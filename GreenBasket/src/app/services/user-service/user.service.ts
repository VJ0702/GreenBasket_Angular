import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../common-services/api.service';
import { ApiResponse } from '../../models/common/api-response.model';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest, AddressRequest } from '../../models/auth-models/login-request-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  // Get user profile
  getUserProfile(userId: string): Observable<UserProfile> {
    return this.apiService.get<ApiResponse<UserProfile>>(`api/User/profile?userId=${userId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch profile');
        }),
        catchError(error => {
          console.error('Get profile error:', error);
          return throwError(() => error);
        })
      );
  }

  // Update user profile
  updateProfile(updateRequest: UpdateProfileRequest): Observable<UserProfile> {
    console.log('UpdateProfileRequest:', updateRequest);
    return this.apiService.post<ApiResponse<UserProfile>>('api/User/profile', updateRequest)
      .pipe(
        map(response => {
          console.log('Update profile response:', response);
          if (response.success && response.data) {
            console.log('UpdateProfileResponse:', response.data);
            return response.data;
          }
          throw new Error(response.message || 'Failed to update profile');
        }),
        catchError(error => {
          console.error('Update profile error:', error);
          return throwError(() => error);
        })
      );
  }

  // Change password
  changePassword(changePasswordRequest: ChangePasswordRequest): Observable<any> {
    return this.apiService.post<ApiResponse<any>>('api/User/change-password', changePasswordRequest)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to change password');
        }),
        catchError(error => {
          console.error('Change password error:', error);
          return throwError(() => error);
        })
      );
  }

  // Upload profile picture
  uploadProfilePicture(userId: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    return this.apiService.post<ApiResponse<{ profilePictureUrl: string }>>('api/User/upload-profile-picture', formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.profilePictureUrl;
          }
          throw new Error(response.message || 'Failed to upload profile picture');
        }),
        catchError(error => {
          console.error('Upload profile picture error:', error);
          return throwError(() => error);
        })
      );
  }

  // Add address
  addAddress(userId: string, address: AddressRequest): Observable<any> {
    return this.apiService.post<ApiResponse<any>>(`api/User/${userId}/addresses`, address)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to add address');
        }),
        catchError(error => {
          console.error('Add address error:', error);
          return throwError(() => error);
        })
      );
  }

  // Update address
  updateAddress(userId: string, addressId: number, address: AddressRequest): Observable<any> {
    return this.apiService.post<ApiResponse<any>>(`api/User/${userId}/addresses/${addressId}`, address)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to update address');
        }),
        catchError(error => {
          console.error('Update address error:', error);
          return throwError(() => error);
        })
      );
  }

  // Delete address
  deleteAddress(userId: string, addressId: number): Observable<any> {
    return this.apiService.get<ApiResponse<any>>(`api/User/${userId}/addresses/${addressId}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to delete address');
        }),
        catchError(error => {
          console.error('Delete address error:', error);
          return throwError(() => error);
        })
      );
  }
}
