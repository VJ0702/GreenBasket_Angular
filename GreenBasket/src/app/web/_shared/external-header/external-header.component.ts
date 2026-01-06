import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CategoryService } from '../../../services/category-service/category.service';
import { CategoryMenuItemComponent } from '../category-menu-item/category-menu-item.component';
import { Category } from '../../../models/category-models/category-search-request';
import { AuthService } from '../../../services/auth-service/auth.service';
import { UserProfile } from '../../../models/auth-models/login-request-model';
import { ToastService } from '../../../services/common-services/toast.service';

@Component({
  selector: 'app-external-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryMenuItemComponent],
  templateUrl: './external-header.component.html',
  styleUrl: './external-header.component.css'
})
export class ExternalHeaderComponent implements OnInit, OnDestroy {
  //private getCategorySubscription?: Subscription;
  categories: Category[] = [];
  currentUser: UserProfile | null = null;
  isLoggedIn: boolean = false;
  userDisplayName: string = '';
  private destroy$ = new Subject<void>();

  constructor(private categoryService: CategoryService
    , public authService: AuthService
    , private cdr: ChangeDetectorRef
    , private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.subscribeToUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading categories', error);
        }
      });
  }

  private subscribeToUser(): void {
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = !!user;
        this.userDisplayName = this.authService.getUserDisplayName();
        this.cdr.markForCheck();
      });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.toastService.success('You have been logged out successfully!');
    }
  }

  toggleCart(): void {
    console.log('Toggle cart');
    // Implement cart toggle logic
  }

  toggleMobileMenu(): void {
    console.log('Toggle mobile menu');
    // Implement mobile menu toggle logic
  }
}
