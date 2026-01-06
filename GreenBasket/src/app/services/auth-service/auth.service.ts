import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UserProfile } from '../../models/auth-models/login-request-model';
import { ApiService } from '../common-services/api.service';
import { ApiResponse } from '../../models/common/api-response.model';

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

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Initialize with user from localStorage if exists
    const storedUser = localStorage.getItem(this.userKey);
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
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);

    // Clear current user subject
    this.currentUserSubject.next(null);

    // Navigate to login
    this.router.navigate(['/login']);
    console.log('Logged out successfully');
  }

  // Token management
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  private setUser(user: UserProfile): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
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

  // Geet user ID
  getUserId(): string | null {
    return this.currentUserValue?.userId || null;
  }

}