import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { ToastService } from '../../../services/common-services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  maskedEmail = '';
  expirationMinutes = 0;
  emailSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    console.log('✅ ForgotPasswordComponent initialized');
  }

  ngOnInit(): void {
    // Initialize form with validation
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
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
    this.successMessage = '';

    // Stop if form is invalid
    if (this.forgotPasswordForm.invalid) {
      this.toastService.error('Please enter a valid email address');
      return;
    }

    this.loading = true;
    const email = this.f['email'].value.trim();

    this.authService.forgotPassword(email)
      .subscribe({
        next: (response) => {
          console.log('Password reset email sent successfully:', response);
          this.loading = false;
          this.emailSent = true;

          // Store response data
          this.successMessage = response.message;
          this.maskedEmail = response.maskedEmail;
          this.expirationMinutes = response.tokenExpirationMinutes;

          // Show success toast
          this.toastService.success('Password reset link sent! Check your email.');

          // Disable form after successful submission
          this.forgotPasswordForm.disable();
        },
        error: (error) => {
          console.error('Forgot password failed:', error);
          this.loading = false;

          // Handle different error scenarios
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.error?.description) {
            this.errorMessage = error.error.description;
          } else if (error.status === 404) {
            // Security best practice: Don't reveal if email exists or not
            this.errorMessage = 'If an account exists with this email, you will receive a password reset link.';
          } else if (error.status === 400) {
            this.errorMessage = 'Please enter a valid email address.';
          } else if (error.status === 429) {
            this.errorMessage = 'Too many requests. Please try again later.';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }

          this.toastService.error(this.errorMessage);
        }
      });
  }

  // Resend reset link
  resendLink(): void {
    this.emailSent = false;
    this.submitted = false;
    this.successMessage = '';
    this.forgotPasswordForm.enable();
    this.toastService.info('You can now resend the password reset link');
  }

  // Navigate back to login
  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}