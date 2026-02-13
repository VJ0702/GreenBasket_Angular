import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, Inject, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ProductService } from '../../../services/product-service/product.service';
import { UtilityService } from '../../../services/common-services/utility.service';
import { ProductListingComponent } from "../../_shared/product-listing/product-listing.component";
import { Product } from '../../../models/product-models/product-details-request';

@Component({
  selector: 'app-home-daily-deals',
  standalone: true,
  imports: [CommonModule, ProductListingComponent],
  templateUrl: './home-daily-deals.component.html',
  styleUrl: './home-daily-deals.component.css'
})
export class HomeDailyDealsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private dealProductsSubscription?: Subscription;
  private isBrowser: boolean;
  private isAlive = true;

  products: Product[] = [];
  loading: boolean = true;
  error: string = '';

  // Drag scroll state
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  // Timer state
  timerDays = 0;
  timerHours = 0;
  timerMinutes = 0;
  timerSeconds = 0;

  constructor(
    private productService: ProductService,
    public utilityService: UtilityService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.fetchDealProducts(7);
    this.initCountdownTimer();
  }

  ngAfterViewInit(): void {
    // No carousel initialization needed - using CSS scroll
  }

  fetchDealProducts(count: number): void {
    this.dealProductsSubscription = this.productService
      .getDealOfTheDayProducts(15)
      .subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = 'Failed to load deal products';
          this.loading = false;
          console.error(err);
        }
      });
  }

  // Countdown Timer
  private initCountdownTimer(): void {
    if (!this.isBrowser) {
      // Set initial values for SSR
      this.timerDays = 7;
      this.timerHours = 12;
      this.timerMinutes = 30;
      this.timerSeconds = 0;
      return;
    }

    // Set deal end date (7 days from now for demo)
    const dealEndDate = new Date();
    dealEndDate.setDate(dealEndDate.getDate() + 7);

    interval(1000)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => {
        const now = new Date().getTime();
        const distance = dealEndDate.getTime() - now;

        if (distance > 0) {
          this.timerDays = Math.floor(distance / (1000 * 60 * 60 * 24));
          this.timerHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          this.timerMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          this.timerSeconds = Math.floor((distance % (1000 * 60)) / 1000);
        } else {
          this.timerDays = 0;
          this.timerHours = 0;
          this.timerMinutes = 0;
          this.timerSeconds = 0;
        }
        this.cdr.markForCheck();
      });
  }

  // Mouse drag scroll handlers
  onMouseDown(event: MouseEvent): void {
    if (!this.isBrowser || !this.scrollContainer) return;

    this.isDragging = true;
    this.startX = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
    this.scrollContainer.nativeElement.style.cursor = 'grabbing';
  }

  onMouseLeave(): void {
    this.isDragging = false;
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.style.cursor = 'grab';
    }
  }

  onMouseUp(): void {
    this.isDragging = false;
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.style.cursor = 'grab';
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.scrollContainer) return;

    event.preventDefault();
    const x = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Scroll speed multiplier
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  ngOnDestroy(): void {
    this.isAlive = false;
    this.dealProductsSubscription?.unsubscribe();
  }
}