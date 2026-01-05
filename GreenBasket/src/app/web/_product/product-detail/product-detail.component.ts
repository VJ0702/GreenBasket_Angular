import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductDetail, ProductSpecification, ProductVariant } from '../../../models/product-models/product-details-request';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../../services/common-services/utility.service';

declare const $: any; // Declare jQuery globally

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: ProductDetail;
  loading = false;
  selectedVariant?: ProductVariant;
  selectedImage?: string;
  topSpecifications?: ProductSpecification[];

  private productSubscription?: Subscription;
  private readonly isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public utilityService: UtilityService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const urlHandle = this.route.snapshot.paramMap.get('urlHandle');

    if (urlHandle) {
      this.loadProductDetails(urlHandle);
    } else {
      console.error('Product URL handle is missing');
    }
  }

  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
    this.destroySlickSliders();
  }

  private loadProductDetails(slug: string): void {
    this.loading = true;

    this.productSubscription = this.productService.getProductDetailsBySlug(slug).subscribe({
      next: (data) => {
        this.product = data;
        this.initializeProductData(data);
        this.loading = false;

        // Initialize sliders after DOM update
        if (this.isBrowser) {
          setTimeout(() => this.initializeSlickSliders(), 100);
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  private initializeProductData(data: ProductDetail): void {
    // Set default variant
    if (data.variants?.length > 0) {
      this.selectedVariant = data.variants[0];
    }

    // Set primary image
    const primaryImage = data.images.find(img => img.isPrimary);
    this.selectedImage = primaryImage?.url || data.images[0]?.url;

    // Get top specifications
    if (data.specifications?.length > 0) {
      this.topSpecifications = data.specifications
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 3);
    }
  }

  private initializeSlickSliders(): void {
    if (!this.isBrowser || typeof $ === 'undefined') return;

    this.destroySlickSliders();

    const $cover = $('.single-product-cover');
    const $thumb = $('.single-nav-thumb');

    // Initialize main product image slider
    $cover.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: false,
      asNavFor: '.single-nav-thumb'
    });

    // Initialize thumbnail slider
    $thumb.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '.single-product-cover',
      dots: false,
      arrows: true,
      focusOnSelect: true,
      responsive: [
        { breakpoint: 768, settings: { slidesToShow: 3 } },
        { breakpoint: 480, settings: { slidesToShow: 2 } }
      ]
    });
  }

  private destroySlickSliders(): void {
    if (!this.isBrowser || typeof $ === 'undefined') return;

    const sliders = ['.single-product-cover', '.single-nav-thumb'];

    sliders.forEach(selector => {
      const $slider = $(selector);
      if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick');
      }
    });
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
  }

  activateReviewTab(event: Event): void {
    event.preventDefault();

    const reviewTab = document.querySelector('#review-tab');
    const reviewContent = document.querySelector('#gi-spt-nav-review');

    if (!reviewTab || !reviewContent) return;

    // Activate review tab
    reviewTab.classList.add('active');
    reviewContent.classList.add('show', 'active');

    // Deactivate other tabs
    document.querySelectorAll('.nav-link:not(#review-tab)').forEach(tab =>
      tab.classList.remove('active')
    );

    document.querySelectorAll('.tab-pane:not(#gi-spt-nav-review)').forEach(pane =>
      pane.classList.remove('show', 'active')
    );
  }
}