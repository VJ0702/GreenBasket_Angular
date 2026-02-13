import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../services/common-services/config.service';
import { CategoryService } from '../../../services/category-service/category.service';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css'
})
export class HomeCategoriesComponent implements OnDestroy, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private getCategorySubscription?: Subscription;
  categories: any[] = [];
  loading = false;

  // Drag scroll properties
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private isBrowser: boolean;

  // Default icon when none provided
  readonly defaultIcon = 'fi fi-tr-peach';

  constructor(
    private configService: ConfigService,
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Set initial scroll position to middle set for infinite scroll effect
      setTimeout(() => this.centerScroll(), 100);
    }
  }

  fetchCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.filter(category => category.imageUrl != null);
        this.loading = false;
        // Center scroll after categories load
        if (this.isBrowser) {
          setTimeout(() => this.centerScroll(), 100);
        }
      },
      error: (err) => {
        console.log('Error in loading categories ', err);
        this.loading = false;
      }
    });
  }

  /**
   * Center the scroll to the middle set of categories
   */
  private centerScroll(): void {
    if (!this.scrollContainer?.nativeElement) return;
    const container = this.scrollContainer.nativeElement;
    const scrollWidth = container.scrollWidth;
    // Position at 1/3 (middle set of 3 sets)
    container.scrollLeft = scrollWidth / 3;
  }

  /**
   * Handle infinite scroll - reset position when reaching ends
   */
  private handleInfiniteScroll(): void {
    if (!this.scrollContainer?.nativeElement) return;
    const container = this.scrollContainer.nativeElement;
    const scrollWidth = container.scrollWidth;
    const oneThird = scrollWidth / 3;

    // If scrolled past 2/3, jump back to 1/3
    if (container.scrollLeft >= oneThird * 2) {
      container.scrollLeft = oneThird;
    }
    // If scrolled before 1/3, jump to 2/3
    else if (container.scrollLeft <= 0) {
      container.scrollLeft = oneThird;
    }
  }

  // ========== DRAG SCROLL HANDLERS ==========

  onMouseDown(event: MouseEvent): void {
    if (!this.scrollContainer?.nativeElement) return;
    this.isDragging = true;
    this.startX = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
    this.scrollContainer.nativeElement.style.cursor = 'grabbing';
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.scrollContainer?.nativeElement) return;
    event.preventDefault();
    const x = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Scroll speed multiplier
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;

    // Check for infinite scroll
    this.handleInfiniteScroll();
  }

  onMouseUp(): void {
    this.isDragging = false;
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.style.cursor = 'grab';
      // Final check for infinite scroll
      this.handleInfiniteScroll();
    }
  }

  /**
   * Get icon class with fallback to default
   */
  getIconClass(iconClass: string | null): string {
    return iconClass && iconClass.trim() ? iconClass : this.defaultIcon;
  }

  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }

  ngOnDestroy(): void {
    this.getCategorySubscription?.unsubscribe();
  }

}
