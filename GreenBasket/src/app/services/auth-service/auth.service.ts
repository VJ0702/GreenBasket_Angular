import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UserProfile } from '../../models/auth-models/login-request-model';
import { ApiService } from '../common-services/api.service';
import { ApiResponse } from '../../models/common/api-response.model';
import { RegisterRequest, RegisterResponse } from '../../models/auth-models/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logInEndpoint = 'api/Auth/login';
  private profileEndpoint = 'api/User/profile';

  private currentUserSubject: BehaviorSubject<UserProfile | null>;
  public currentUser: Observable<UserProfile | null>;

  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'current_user';

  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Initialize with user from localStorage if exists (only in browser)
    const storedUser = this.isBrowser ? this.getStorageItem(this.userKey) : null;
    this.currentUserSubject = new BehaviorSubject<UserProfile | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Get current user value
  public get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  public get isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserValue;
  }

  // Login method
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    console.log('Login attempt with:', { username: loginRequest.username, rememberme: loginRequest.rememberme });

    return this.apiService.post<ApiResponse<LoginResponse>>(this.logInEndpoint, loginRequest)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            console.log('Login successful', response);

            // Extract user profile from response
            const userProfile: UserProfile = {
              userId: response.data.userId,
              username: response.data.username,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
              roles: response.data.roles,
              profilePictureUrl: response.data.profilePictureUrl,
              createdAt: '',
              modifiedAt: ''
            };

            // Store tokens and user info
            this.setToken(response.data.accessToken);
            this.setRefreshToken(response.data.refreshToken);
            this.setUser(userProfile);
            this.currentUserSubject.next(userProfile);

            return response.data;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  // Logout method
  logout(): void {
    console.log('Logging out...');

    // Clear local storage
    this.removeStorageItem(this.tokenKey);
    this.removeStorageItem(this.refreshTokenKey);
    this.removeStorageItem(this.userKey);

    // Clear current user subject
    this.currentUserSubject.next(null);

    // Navigate to login
    this.router.navigate(['/login']);
    console.log('Logged out successfully');
  }

  // Token management with browser check
  getToken(): string | null {
    return this.getStorageItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return this.getStorageItem(this.refreshTokenKey);
  }

  private setToken(token: string): void {
    this.setStorageItem(this.tokenKey, token);
  }

  private setRefreshToken(token: string): void {
    this.setStorageItem(this.refreshTokenKey, token);
  }

  private setUser(user: UserProfile): void {
    this.setStorageItem(this.userKey, JSON.stringify(user));
  }

  // Get user profile from API
  getUserProfile(): Observable<UserProfile> {
    const userId = this.getUserId();
    const url = userId ? `${this.profileEndpoint}?userId=${userId}` : this.profileEndpoint;

    return this.apiService.get<ApiResponse<UserProfile>>(url)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setUser(response.data);
            this.currentUserSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch user profile');
          }
        }),
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return throwError(() => error);
        })
      );
  }

  // Get user display name
  getUserDisplayName(): string {
    const user = this.currentUserValue;
    if (!user) return 'Guest';
    return `${user.firstName} ${user.lastName}`.trim() || user.username;
  }

  // Get user role
  getUserRole(): string {
    return this.currentUserValue?.roles || '';
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const userRoles = this.getUserRole().toLowerCase();
    return userRoles.includes(role.toLowerCase());
  }

  // Get user ID
  getUserId(): string | null {
    return this.currentUserValue?.userId || null;
  }

  // Safe localStorage methods with browser check
  private getStorageItem(key: string): string | null {
    if (this.isBrowser) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  private setStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }
  }

  private removeStorageItem(key: string): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  }

  // Add this method to auth.service.ts
  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    console.log('Registration attempt for:', registerRequest.email);

    // Set default role to Customer if not provided
    if (!registerRequest.roleName) {
      registerRequest.roleName = 'Customer';
    }

    return this.apiService.post<ApiResponse<RegisterResponse>>('api/Auth/register', registerRequest)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            console.log('Registration successful', response);
            return response.data;
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  // Check if username is available
  checkUsernameAvailability(username: string): Observable<boolean> {
    //debugger;
    return this.apiService.get<ApiResponse<boolean>>(
      `api/Auth/check-username?username=${encodeURIComponent(username)}`
    ).pipe(
      map(response => {
        if (response.success && response.data !== undefined) {
          // data: true means username EXISTS (not available)
          // data: false means username is AVAILABLE
          // So we need to INVERT the boolean
          return !response.data;
        }
        // If something goes wrong, assume it's taken (safer approach)
        return false;
      }),
      catchError(error => {
        console.error('Error checking username:', error);
        return throwError(() => error);
      })
    );
  }

  // Check if email is available
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.apiService.get<ApiResponse<boolean>>(
      `api/Auth/check-email?email=${encodeURIComponent(email)}`
    ).pipe(
      map(response => {
        if (response.success && response.data !== undefined) {
          // data: true means email EXISTS (not available)
          // data: false means email is AVAILABLE
          // So we need to INVERT the boolean
          return !response.data;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error checking email:', error);
        return throwError(() => error);
      })
    );
  }

  // Check if phone number is available
  checkPhoneAvailability(phoneNumber: string): Observable<boolean> {
    return this.apiService.get<ApiResponse<boolean>>(
      `api/Auth/check-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`
    ).pipe(
      map(response => {
        if (response.success && response.data !== undefined) {
          // data: true means phone number EXISTS (not available)
          // data: false means phone number is AVAILABLE
          // So we need to INVERT the boolean
          return !response.data;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error checking phone:', error);
        return throwError(() => error);
      })
    );
  }
}