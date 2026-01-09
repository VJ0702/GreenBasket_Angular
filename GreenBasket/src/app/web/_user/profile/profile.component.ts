import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { UserService } from '../../../services/user-service/user.service';
import { ToastService } from '../../../services/common-services/toast.service';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest, AddressRequest, Address } from '../../../models/auth-models/login-request-model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  activeTab: 'profile' | 'addresses' | 'password' | 'picture' = 'profile';

  userProfile: UserProfile | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  addressForm!: FormGroup;

  loading = false;
  profileLoading = false;
  passwordLoading = false;
  addressLoading = false;
  pictureLoading = false;

  profileSubmitted = false;
  passwordSubmitted = false;
  addressSubmitted = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  editingAddress: Address | null = null;
  showAddressModal = false;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  private isBrowser: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Check if user is logged in
    if (!this.authService.isLoggedIn) {
      this.toastService.info('Please login to view your profile');
      this.router.navigate(['/login']);
      return;
    }

    this.initializeForms();
    this.loadUserProfile();
  }

  initializeForms(): void {
    // Profile form
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });

    // Password form
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Address form
    this.addressForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      companyName: [''],
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      county: [''],
      zipPostalCode: ['', [Validators.required]],
      countryId: [''],
      stateProvinceId: [''],
      isBillingAddress: [false],
      isShippingAddress: [false]
    });
  }

  loadUserProfile(): void {
    this.loading = true;
    const currentUser = this.authService.currentUserValue;

    if (!currentUser?.userId) {
      this.toastService.error('User session expired. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserProfile(currentUser.userId)
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.loading = false;

          // Populate profile form
          this.profileForm.patchValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phoneNumber: profile.phoneNumber
          });
        },
        error: (error) => {
          console.error('Failed to load profile:', error);
          this.loading = false;
          this.toastService.error('Failed to load profile');
        }
      });
  }

  // Password strength validator
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);

    return (hasNumber && (hasUpper || hasLower)) ? null : { passwordStrength: true };
  }

  // Password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) return null;
    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Switch tabs
  switchTab(tab: 'profile' | 'addresses' | 'password' | 'picture'): void {
    this.activeTab = tab;
    this.profileSubmitted = false;
    this.passwordSubmitted = false;
    this.addressSubmitted = false;
  }

  // Update profile
  updateProfile(): void {
    this.profileSubmitted = true;

    if (this.profileForm.invalid) {
      this.toastService.error('Please fill all required fields');
      return;
    }

    this.profileLoading = true;
    const currentUser = this.authService.currentUserValue;

    const updateRequest: UpdateProfileRequest = {
      userId: currentUser!.userId,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.userProfile!.email,
      phoneNumber: this.profileForm.value.phoneNumber
    };

    this.userService.updateProfile(updateRequest)
      .subscribe({
        next: (updatedProfile) => {
          this.userProfile = updatedProfile;
          this.profileLoading = false;
          this.toastService.success('Profile updated successfully');
        },
        error: (error) => {
          console.error('Profile update failed:', error);
          this.profileLoading = false;
          this.toastService.error(error.error?.message || 'Failed to update profile');
        }
      });
  }

  // Change password
  changePassword(): void {
    this.passwordSubmitted = true;

    if (this.passwordForm.invalid) {
      this.toastService.error('Please fill all required fields correctly');
      return;
    }

    this.passwordLoading = true;
    const currentUser = this.authService.currentUserValue;

    const changePasswordRequest: ChangePasswordRequest = {
      userId: currentUser!.userId,
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
      confirmPassword: this.passwordForm.value.confirmPassword
    };

    this.userService.changePassword(changePasswordRequest)
      .subscribe({
        next: () => {
          this.passwordLoading = false;
          this.toastService.success('Password changed successfully');
          this.passwordForm.reset();
          this.passwordSubmitted = false;
        },
        error: (error) => {
          console.error('Password change failed:', error);
          this.passwordLoading = false;
          this.toastService.error(error.error?.message || 'Failed to change password');
        }
      });
  }

  // Toggle password visibility
  togglePasswordVisibility(field: string): void {
    if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
    else if (field === 'new') this.showNewPassword = !this.showNewPassword;
    else if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Open address modal
  openAddressModal(address?: Address): void {
    this.editingAddress = address || null;
    this.showAddressModal = true;

    if (address) {
      this.addressForm.patchValue(address);
    } else {
      this.addressForm.reset();
      this.addressForm.patchValue({
        isBillingAddress: false,
        isShippingAddress: false
      });
    }
  }

  // Close address modal
  closeAddressModal(): void {
    this.showAddressModal = false;
    this.editingAddress = null;
    this.addressForm.reset();
    this.addressSubmitted = false;
  }

  // Save address
  saveAddress(): void {
    this.addressSubmitted = true;

    if (this.addressForm.invalid) {
      this.toastService.error('Please fill all required fields');
      return;
    }

    this.addressLoading = true;
    const currentUser = this.authService.currentUserValue;
    const addressData: AddressRequest = this.addressForm.value;

    const saveObservable = this.editingAddress
      ? this.userService.updateAddress(currentUser!.userId, this.editingAddress.id, addressData)
      : this.userService.addAddress(currentUser!.userId, addressData);

    saveObservable.subscribe({
      next: () => {
        this.addressLoading = false;
        this.toastService.success(this.editingAddress ? 'Address updated successfully' : 'Address added successfully');
        this.closeAddressModal();
        this.loadUserProfile();
      },
      error: (error) => {
        console.error('Address save failed:', error);
        this.addressLoading = false;
        this.toastService.error(error.error?.message || 'Failed to save address');
      }
    });
  }

  // Delete address
  deleteAddress(addressId: number): void {
    if (!confirm('Are you sure you want to delete this address?')) return;

    const currentUser = this.authService.currentUserValue;

    this.userService.deleteAddress(currentUser!.userId, addressId)
      .subscribe({
        next: () => {
          this.toastService.success('Address deleted successfully');
          this.loadUserProfile();
        },
        error: (error) => {
          console.error('Address delete failed:', error);
          this.toastService.error('Failed to delete address');
        }
      });
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.toastService.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.toastService.error('Image size should not exceed 5MB');
      return;
    }

    this.selectedFile = file;

    // Preview image
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Upload profile picture
  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      this.toastService.error('Please select an image');
      return;
    }

    this.pictureLoading = true;
    const currentUser = this.authService.currentUserValue;

    this.userService.uploadProfilePicture(currentUser!.userId, this.selectedFile)
      .subscribe({
        next: (profilePictureUrl) => {
          //console.log('Profile picture uploaded:', profilePictureUrl);

          // Update the userProfile with new picture URL
          if (this.userProfile) {
            this.userProfile.profilePictureUrl = profilePictureUrl;
          }

          // Clear the selected file and preview
          this.selectedFile = null;
          this.previewUrl = null;

          this.pictureLoading = false;
          this.toastService.success('Profile picture updated successfully');
        },
        error: (error) => {
          console.error('Profile picture upload failed:', error);
          this.pictureLoading = false;

          // Handle specific error messages
          const errorMessage = error.error?.message ||
            error.error?.description ||
            'Failed to upload profile picture';
          this.toastService.error(errorMessage);
        }
      });
  }

  // Get password strength
  getPasswordStrength(): string {
    const password = this.passwordForm.get('newPassword')?.value;
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

  // Getters for forms
  get pf() { return this.profileForm.controls; }
  get pwf() { return this.passwordForm.controls; }
  get af() { return this.addressForm.controls; }
}