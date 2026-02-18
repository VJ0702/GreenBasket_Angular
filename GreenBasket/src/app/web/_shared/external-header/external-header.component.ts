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
import { HeaderConfig, SiteConfig } from '../../../models/home-data/site-config';
import { SiteConfigService } from '../../../services/home-data/site-config.service';
import { UtilityService } from '../../../services/common-services/utility.service';

@Component({
  selector: 'app-external-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './external-header.component.html',
  styleUrl: './external-header.component.css'
})
export class ExternalHeaderComponent implements OnInit, OnDestroy {
  //private getCategorySubscription?: Subscription;
  categories: Category[] = [];
  mainCategories: Category[] = [];
  currentUser: UserProfile | null = null;
  isLoggedIn: boolean = false;
  userDisplayName: string = '';
  private destroy$ = new Subject<void>();

  // Mega menu selection tracking
  selectedCategoryIndex: number = 0;
  selectedChildIndex: number = 0;

  // Configuration properties with defaults
  siteName: string = 'GreenBasket';
  siteTagline: string = "India's Largest Organic Fruits & Vegs Store";
  logoUrl: string = '';
  phone1: string = '';
  phone2: string = '';
  email: string = '';
  showSearchBar: boolean = true;
  showCartIcon: boolean = true;
  showWishlistIcon: boolean = true;

  constructor(private categoryService: CategoryService
    , public authService: AuthService
    , private cdr: ChangeDetectorRef
    , private toastService: ToastService
    , private siteConfigService: SiteConfigService
    , private utilityService: UtilityService
  ) {
    // Get config synchronously (instantly available from localStorage or default)
    this.updateConfigData();
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.subscribeToUser();

    // Subscribe to config updates (background refresh)
    this.siteConfigService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        if (config) {
          this.updateConfigData();
          this.cdr.markForCheck();
        }
      });
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
          this.mainCategories = data.filter(
            c => c.iconClass && c.iconClass.trim() !== '');
          this.categories = data; // For now, main categories are the ones we show in header
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

  // Mega menu selection methods
  selectCategory(index: number): void {
    this.selectedCategoryIndex = index;
    this.selectedChildIndex = 0; // Reset child selection when parent changes
  }

  selectChild(index: number): void {
    this.selectedChildIndex = index;
  }

  resetMenuSelection(): void {
    this.selectedCategoryIndex = 0;
    this.selectedChildIndex = 0;
  }

  // Safe getters for selected categories
  get selectedCategory(): Category | null {
    return this.categories[this.selectedCategoryIndex] || null;
  }

  get selectedCategoryChildren(): Category[] {
    return this.selectedCategory?.subCategories || [];
  }

  get selectedChild(): Category | null {
    return this.selectedCategoryChildren[this.selectedChildIndex] || null;
  }

  get selectedChildSubCategories(): Category[] {
    return this.selectedChild?.subCategories || [];
  }

  hasSubCategories(category: Category | null): boolean {
    return !!(category?.subCategories && category.subCategories.length > 0);
  }

  //Get full image URL for logo and other images   
  getFullImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'images/logo/logo.png';
    else return this.utilityService.getFullImageUrl(imageUrl);
  }

  private updateConfigData(): void {
    const config = this.siteConfigService.getCurrentConfig();

    if (config) {
      this.showSearchBar = config.header?.showSearchBar ?? true;
      this.showCartIcon = config.header?.showCartIcon ?? true;
      this.showWishlistIcon = config.header?.showWishlistIcon ?? true;
      this.siteName = config.siteName || 'GreenBasket';
      this.siteTagline = config.siteTagline || config.header?.tagline || "India's Largest Organic Fruits & Vegs Store";
      this.logoUrl = config.logoUrl || '';
      this.phone1 = config.phone1 || '';
      this.phone2 = config.phone2 || '';
      this.email = config.email || '';
    }
  }
}
