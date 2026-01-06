import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../../models/auth-models/login-request-model';
import { ToastService } from '../../../services/common-services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  returnUrl: string = '/';
  showPassword = false;

  constructor(private formBuilder: FormBuilder
    , private authService: AuthService
    , private router: Router
    , private route: ActivatedRoute
    , private toastService: ToastService
  ) {
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn) {
      this.toastService.info('You are already logged in!');
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // Initialize form with validation
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberme: [false]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form values:', this.loginForm.value);
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const loginRequest: LoginRequest = {
      username: this.f['username'].value,
      password: this.f['password'].value,
      rememberme: this.f['rememberme'].value
    };

    this.authService.login(loginRequest)
      .subscribe({
        next: (response) => {
          console.log('Login successful, redirecting to:', this.returnUrl);
          this.loading = false;

          // Show success message
          this.toastService.success('Welcome back! Login successful.');

          // Navigate to return url or home
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loading = false;

          // Handle different error scenarios based on your API response structure
          if (error.error?.message) {
            // If API returns ApiResponse with message
            this.errorMessage = error.error.message;
          } else if (error.error?.description) {
            // If API returns ApiResponse with description
            this.errorMessage = error.error.description;
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid username or password';
          } else if (error.status === 400) {
            this.errorMessage = 'Please check your input and try again';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'An error occurred during login. Please try again.';
          }
        }
      });
  }
}
