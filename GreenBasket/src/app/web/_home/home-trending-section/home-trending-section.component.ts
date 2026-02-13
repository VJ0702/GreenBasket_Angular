import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { BannerService } from '../../../services/home-data/banner.service';
import { UtilityService } from '../../../services/common-services/utility.service';
import { Banner } from '../../../models/home-data/banner';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../../services/product-service/product.service';
import { Product } from '../../../models/product-models/product-details-request';
import { RouterModule } from '@angular/router';

// ✅ Declare jQuery
declare var $: any;

@Component({
  selector: 'app-home-trending-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-trending-section.component.html',
  styleUrl: './home-trending-section.component.css'
})
export class HomeTrendingSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  // Single banner object (not array)
  selectedBanner: Banner | null = null;
  banners: Banner[] = [];

  trendingItems: Product[] = [];
  topRatedItems: Product[] = [];
  topSellingItems: Product[] = [];

  // Pagination indexes for each section
  trendingCurrentIndex = 0;
  topRatedCurrentIndex = 0;
  topSellingCurrentIndex = 0;

  // Number of products to show at a time
  readonly productsPerPage = 3;

  isLoadingProducts = true;
  productsError: string | null = null;

  private isBrowser: boolean;
  private carouselsInitialized = false;

  constructor(private bannerService: BannerService,
    public utilityService: UtilityService,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.fetchSideBanner();
    if (this.isBrowser) {
      this.loadHomepageProducts();
    }
  }

  ngAfterViewInit(): void {
    // Carousel init happens after products load
  }

  ngOnDestroy(): void {
    if (this.isBrowser && typeof $ !== 'undefined') {
      $('.gi-trending-slider, .gi-rated-slider, .gi-selling-slider').trigger('destroy.owl.carousel');
    }
  }

  private loadHomepageProducts(forceRefresh: boolean = false): void {
    this.isLoadingProducts = true;
    this.productsError = null;

    this.productService.getHomepageProducts(9, 9, 9, forceRefresh).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.trendingItems = response.data.trendingItems || [];
          this.topRatedItems = response.data.topRated || [];
          this.topSellingItems = response.data.topSelling || [];
        } else {
          this.productsError = response.message || 'Failed to load products';
        }
        this.isLoadingProducts = false;

        // Init carousels after data is ready
        // if (this.isBrowser) {
        //   setTimeout(() => this.initializeCarousels(), 100);
        // }
      },
      error: (err) => {
        this.productsError = 'Failed to load products';
        this.isLoadingProducts = false;
        console.error('Error loading homepage products:', err);
      }
    });
  }

  // ========== OWL CAROUSEL ==========
  private initializeCarousels(): void {
    if (this.carouselsInitialized || typeof $ === 'undefined' || typeof $.fn.owlCarousel === 'undefined') {
      return;
    }

    try {
      const commonConfig = {
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        navText: ['<i class="fi-rr-angle-small-left"></i>', '<i class="fi-rr-angle-small-right"></i>'],
        items: 1,
        autoHeight: false
      };

      const $trending = $('.gi-trending-slider');
      const $rated = $('.gi-rated-slider');
      const $selling = $('.gi-selling-slider');

      if ($trending.length && !$trending.hasClass('owl-loaded')) {
        $trending.owlCarousel(commonConfig);
      }

      if ($rated.length && !$rated.hasClass('owl-loaded')) {
        $rated.owlCarousel(commonConfig);
      }

      if ($selling.length && !$selling.hasClass('owl-loaded')) {
        $selling.owlCarousel(commonConfig);
      }

      this.carouselsInitialized = true;
      console.log('✅ Owl Carousels initialized');
    } catch (error) {
      console.error('❌ Error initializing Owl Carousels:', error);
    }
  }

  fetchSideBanner(): void {

    // Fetch only 1 side banner for optimization
    this.bannerService.getSideBanners(1).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Check if data has banners array (nested structure)
          const bannersArray = (response.data as any).banners || response.data;

          //console.log('Banners array:', bannersArray);

          if (Array.isArray(bannersArray) && bannersArray.length > 0) {
            // Get first banner from array
            this.selectedBanner = bannersArray[0];
            //console.log('✅ Selected side banner:', this.selectedBanner);
          } else if (!Array.isArray(bannersArray) && bannersArray) {
            // If data itself is a single banner object
            this.selectedBanner = bannersArray;
            //console.log('✅ Selected side banner (direct):', this.selectedBanner);
          } else {
            console.log('❌ No side banners available');
            this.selectedBanner = null;
          }
        } else {
          console.log('❌ Response not successful or no data');
          this.selectedBanner = null;
        }
      },
      error: (err) => {
        console.error('❌ Error fetching side banner:', err);
        this.selectedBanner = null;
      }
    });
  }


  //Alternative: Fetch multiple and randomly select one   
  fetchRandomSideBanner(): void {
    console.log('🔄 Fetching random side banner from multiple...');

    // Fetch up to 5 side banners and pick one randomly
    this.bannerService.getSideBanners(5).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const bannersArray = (response.data as any).banners || response.data;

          if (Array.isArray(bannersArray) && bannersArray.length > 0) {
            // Randomly select one banner
            const randomIndex = Math.floor(Math.random() * bannersArray.length);
            this.selectedBanner = bannersArray[randomIndex];
            console.log('✅ Selected random side banner:', this.selectedBanner);
          } else {
            console.log('❌ No side banners available');
            this.selectedBanner = null;
          }
        } else {
          console.log('❌ Response not successful or no data');
          this.selectedBanner = null;
        }
      },
      error: (err) => {
        console.error('❌ Error fetching side banners:', err);
        this.selectedBanner = null;
      }
    });
  }

  //Get text alignment with null safety  
  getTextAlignment(banner: Banner): string {
    return banner.textAlignment ? banner.textAlignment.toLowerCase() : 'left';
  }
  //Check if banner has button  
  hasButton(banner: Banner): boolean {
    return !!banner.buttonText;
  }

  // ========== HELPERS ==========
  // getProductUrl(product: Product): string {
  //   return `/product/${product.urlHandle}`;
  // }

  // getCategoryUrl(category: any): string {
  //   return `/category/${category.urlHandle}`;
  // }

  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  hasOldPrice(product: Product): boolean {
    return product.oldPrice !== null && product.oldPrice > product.price;
  }

  getDiscountPercent(product: Product): number {
    if (!product.oldPrice || product.oldPrice <= product.price) return 0;
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }

  /**
 * Group products into sets of 3 for carousel slides
 */
  getTrendingGroups(): Product[][] {
    return this.groupProducts(this.trendingItems);
  }

  getTopRatedGroups(): Product[][] {
    return this.groupProducts(this.topRatedItems);
  }

  getTopSellingGroups(): Product[][] {
    return this.groupProducts(this.topSellingItems);
  }

  /**
   * Helper method to group products into chunks of 3
   */
  private groupProducts(products: Product[]): Product[][] {
    const grouped: Product[][] = [];
    for (let i = 0; i < products.length; i += 3) {
      grouped.push(products.slice(i, i + 3));
    }
    return grouped;
  }

  /**
   * Retry loading products after error
   */
  retryLoadProducts(): void {
    this.loadHomepageProducts(true);
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product): void {
    // TODO: Implement cart service integration
    console.log('Adding to cart:', product);
    // Example: this.cartService.addToCart(product, 1);
  }

  // ========== PAGINATION NAVIGATION ==========

  /**
   * Get visible products for a section based on current index
   */
  getVisibleProducts(section: 'trending' | 'topRated' | 'topSelling'): Product[] {
    let items: Product[];
    let currentIndex: number;

    switch (section) {
      case 'trending':
        items = this.trendingItems;
        currentIndex = this.trendingCurrentIndex;
        break;
      case 'topRated':
        items = this.topRatedItems;
        currentIndex = this.topRatedCurrentIndex;
        break;
      case 'topSelling':
        items = this.topSellingItems;
        currentIndex = this.topSellingCurrentIndex;
        break;
    }

    const startIndex = currentIndex * this.productsPerPage;
    return items.slice(startIndex, startIndex + this.productsPerPage);
  }

  /**
   * Get total number of slides for a section
   */
  getTotalSlides(section: 'trending' | 'topRated' | 'topSelling'): number {
    let items: Product[];

    switch (section) {
      case 'trending':
        items = this.trendingItems;
        break;
      case 'topRated':
        items = this.topRatedItems;
        break;
      case 'topSelling':
        items = this.topSellingItems;
        break;
    }

    return Math.ceil(items.length / this.productsPerPage);
  }

  /**
   * Navigate to next slide
   */
  nextSlide(section: 'trending' | 'topRated' | 'topSelling'): void {
    const totalSlides = this.getTotalSlides(section);

    switch (section) {
      case 'trending':
        if (this.trendingCurrentIndex < totalSlides - 1) {
          this.trendingCurrentIndex++;
        }
        break;
      case 'topRated':
        if (this.topRatedCurrentIndex < totalSlides - 1) {
          this.topRatedCurrentIndex++;
        }
        break;
      case 'topSelling':
        if (this.topSellingCurrentIndex < totalSlides - 1) {
          this.topSellingCurrentIndex++;
        }
        break;
    }
  }

  /**
   * Navigate to previous slide
   */
  prevSlide(section: 'trending' | 'topRated' | 'topSelling'): void {
    switch (section) {
      case 'trending':
        if (this.trendingCurrentIndex > 0) {
          this.trendingCurrentIndex--;
        }
        break;
      case 'topRated':
        if (this.topRatedCurrentIndex > 0) {
          this.topRatedCurrentIndex--;
        }
        break;
      case 'topSelling':
        if (this.topSellingCurrentIndex > 0) {
          this.topSellingCurrentIndex--;
        }
        break;
    }
  }

}
