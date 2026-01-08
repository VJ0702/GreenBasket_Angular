import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { ToastService } from '../../../services/common-services/toast.service';
import { ResetPasswordRequest } from '../../../models/auth-models/forgot-password-model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  email = '';
  token = '';
  tokenValidating = true;
  tokenValid = false;
  resetSuccess = false;
  showPassword = false;
  showConfirmPassword = false;
  private isBrowser: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    // Get email and token from query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';

      //console.log('Reset password params:', { email: this.email, tokenLength: this.token?.length });

      if (!this.email || !this.token) {
        this.tokenValidating = false;
        this.tokenValid = false;
        this.errorMessage = 'Invalid password reset link. Please request a new one.';
        this.toastService.error('Invalid or missing reset link parameters');
        return;
      }

      // Validate token
      this.validateToken();
    });

    // Initialize form with validation
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
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
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Validate reset token
  validateToken(): void {
    this.tokenValidating = true;

    this.authService.validateResetToken(this.email, this.token)
      .subscribe({
        next: (isValid) => {
          this.tokenValidating = false;
          this.tokenValid = isValid;

          if (!isValid) {
            this.errorMessage = 'This password reset link has expired or is invalid. Please request a new one.';
            this.toastService.error('Invalid or expired reset link');
          } else {
            //console.log('✅ Token is valid');
            this.toastService.success('You can now reset your password');
          }
        },
        error: (error) => {
          console.error('Token validation failed:', error);
          this.tokenValidating = false;
          this.tokenValid = false;
          this.errorMessage = 'Failed to validate reset token. Please try again or request a new link.';
          this.toastService.error('Token validation failed');
        }
      });
  }

  // Convenience getter for form fields
  get f() {
    return this.resetPasswordForm.controls;
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

  // Get password strength
  getPasswordStrength(): string {
    const password = this.f['newPassword'].value;
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

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.resetPasswordForm.invalid) {
      this.toastService.error('Please fill all required fields correctly');
      return;
    }

    this.loading = true;

    const resetRequest: ResetPasswordRequest = {
      email: this.email,
      resetToken: this.token,
      newPassword: this.f['newPassword'].value,
      confirmPassword: this.f['confirmPassword'].value
    };

    this.authService.resetPassword(resetRequest)
      .subscribe({
        next: (response) => {
          //console.log('Password reset successful:', response);
          this.loading = false;
          this.resetSuccess = true;

          // Show success message
          this.toastService.success('Password reset successful! Redirecting to login...');

          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          console.error('Password reset failed:', error);
          this.loading = false;

          // Handle different error scenarios
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.error?.description) {
            this.errorMessage = error.error.description;
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid password. Please check the requirements.';
          } else if (error.status === 401 || error.status === 404) {
            this.errorMessage = 'Invalid or expired reset token. Please request a new password reset link.';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else {
            this.errorMessage = 'An error occurred while resetting your password. Please try again.';
          }

          this.toastService.error(this.errorMessage);
        }
      });
  }

  // Request new reset link
  requestNewLink(): void {
    this.router.navigate(['/forgot-password']);
  }
}