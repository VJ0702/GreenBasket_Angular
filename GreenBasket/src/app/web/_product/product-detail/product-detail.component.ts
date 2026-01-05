import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductDetail, ProductDetailsRequest, ProductSpecification, ProductVariant } from '../../../models/product-models/product-details-request';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../../services/common-services/utility.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'] // Corrected property name
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: ProductDetail;
  loading = false;
  selectedVariant?: ProductVariant;
  selectedImage?: string;
  topSpecifications?: ProductSpecification[];
  private productSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public utilityService: UtilityService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    const urlHandle = this.route.snapshot.paramMap.get('urlHandle');

    if (urlHandle) {
      this.getProductDetails(urlHandle);
    } else {
      console.error('Product urlHandle parameter is missing');
    }
  }

  getProductDetails(slug: string): void {
    this.loading = true;
    this.productSubscription = this.productService.getProductDetailsBySlug(slug).subscribe({
      next: (data) => {
        //console.log('Product details:', data);
        this.product = data;

        // Set default selected variant (first one)
        if (data.variants && data.variants.length > 0) {
          this.selectedVariant = data.variants[0];
        }

        // Set primary image as selected
        const primaryImage = data.images.find(img => img.isPrimary);
        this.selectedImage = primaryImage ? primaryImage.url : data.images[0]?.url;

        // Get top 3 specifications
        if (data.specifications && data.specifications.length > 0) {
          this.topSpecifications = data.specifications
            .slice().sort((a, b) => a.displayOrder - b.displayOrder)
            .slice(0, 3);
        }

        this.loading = false;

        // Initialize Slick slider after images are loaded
        setTimeout(() => {
          this.initializeProductSlider();
        }, 100);
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
        this.loading = false;
      }
    });
  }

  initializeProductSlider(): void {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Destroy existing slick if it exists
    const $cover: any = (window as any).$('.single-product-cover');
    const $thumb: any = (window as any).$('.single-nav-thumb');

    if ($cover.hasClass('slick-initialized')) {
      $cover.slick('unslick');
    }
    if ($thumb.hasClass('slick-initialized')) {
      $thumb.slick('unslick');
    }

    // Initialize Slick slider for product images
    $cover.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: false,
      asNavFor: '.single-nav-thumb',
    });

    $thumb.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '.single-product-cover',
      dots: false,
      arrows: true,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
          }
        }
      ]
    });
  }
  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
  }

  // selectImage(imageUrl: string): void {
  //   this.selectedImage = imageUrl;
  // }

  activateReviewTab(event: Event): void {
    event.preventDefault();
    const reviewTab = document.querySelector('#review-tab');
    const reviewTabContent = document.querySelector('#gi-spt-nav-review');

    if (reviewTab && reviewTabContent) {
      reviewTab.classList.add('active');
      reviewTabContent.classList.add('show', 'active');

      document.querySelectorAll('.nav-link:not(#review-tab)').forEach(tab => {
        tab.classList.remove('active');
      });

      document.querySelectorAll('.tab-pane:not(#gi-spt-nav-review)').forEach(content => {
        content.classList.remove('show', 'active');
      });
    }
  }

  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();

    // Destroy Slick slider instances (only in browser)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const $cover: any = (window as any).$('.single-product-cover');
    const $thumb: any = (window as any).$('.single-nav-thumb');

    if ($cover.hasClass('slick-initialized')) {
      $cover.slick('unslick');
    }
    if ($thumb.hasClass('slick-initialized')) {
      $thumb.slick('unslick');
    }
  }
}