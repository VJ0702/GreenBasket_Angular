import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, AsyncValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { ToastService } from '../../../services/common-services/toast.service';
import { RegisterRequest } from '../../../models/auth-models/register-request';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn) {
      this.toastService.info('You are already logged in!');
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {

    // Initialize form with validation including async validators
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      username: ['',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9_]+$/)],
        [this.usernameAsyncValidator()] // Add async validator
      ],
      email: ['',
        [Validators.required, Validators.email],
        [this.emailAsyncValidator()] // Add async validator
      ],
      phoneNumber: ['',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        [this.phoneAsyncValidator()] // Add async validator
      ],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasNumber && (hasUpper || hasLower);

    return !passwordValid ? { passwordStrength: true } : null;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Toggle password visibility
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Clear error message when user starts typing
  clearError(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      this.toastService.error('Please fill all required fields correctly');
      return;
    }

    this.loading = true;

    const registerRequest: RegisterRequest = {
      firstName: this.f['firstName'].value.trim(),
      lastName: this.f['lastName'].value.trim(),
      username: this.f['username'].value.trim(),
      email: this.f['email'].value.trim(),
      phoneNumber: this.f['phoneNumber'].value.trim(),
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value,
      roleName: 'Customer' // Default role
    };

    this.authService.register(registerRequest)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.loading = false;

          // Show success message
          this.toastService.success('Registration successful! Please login with your credentials.');

          // Redirect to login page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.loading = false;

          // Handle different error scenarios
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.error?.description) {
            this.errorMessage = error.error.description;
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid registration details. Please check your input.';
          } else if (error.status === 409) {
            this.errorMessage = 'Username or email already exists. Please try different credentials.';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again.';
          }

          this.toastService.error(this.errorMessage);
        }
      });
  }

  // Get password strength
  getPasswordStrength(): string {
    const password = this.f['password'].value;
    if (!password) return '';

    const hasNumber = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [hasNumber, hasUpper, hasLower, hasSpecial].filter(Boolean).length;

    if (password.length < 6) return 'weak';
    if (strength <= 2) return 'medium';
    return 'strong';
  }

  // Async validator for username
  usernameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.length < 3) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500), // Wait 500ms after user stops typing
        distinctUntilChanged(),
        switchMap(username =>
          this.authService.checkUsernameAvailability(username).pipe(
            map(isAvailable => {
              //console.log(`Username "${username}" availability:`, isAvailable);
              return isAvailable ? null : { usernameTaken: true };
            }),
            catchError(() => of(null)) // On error, don't block the form
          )
        ),
        first()
      );
    };
  }

  // Async validator for email
  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || !control.value.includes('@')) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email =>
          this.authService.checkEmailAvailability(email).pipe(
            map(isAvailable => {
              return isAvailable ? null : { emailTaken: true };
            }),
            catchError(() => of(null))
          )
        ),
        first()
      );
    };
  }

  // Async validator for phone number
  phoneAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.length !== 10) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(phone =>
          this.authService.checkPhoneAvailability(phone).pipe(
            map(isAvailable => {
              return isAvailable ? null : { phoneTaken: true };
            }),
            catchError(() => of(null))
          )
        ),
        first()
      );
    };
  }
}
