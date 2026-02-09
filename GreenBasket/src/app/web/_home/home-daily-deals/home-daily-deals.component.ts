import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product-service/product.service';
import { UtilityService } from '../../../services/common-services/utility.service';
import { CommonModule } from '@angular/common';
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
  private dealProductsSubscription?: Subscription;
  products: Product[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private productService: ProductService,
    public utilityService: UtilityService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.fetchDealProducts(7);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      ////this.initializeCarousel();
    }
  }

  fetchDealProducts(count: number): void {
    this.dealProductsSubscription = this.productService
      .getDealOfTheDayProducts(count)
      .subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
          if (isPlatformBrowser(this.platformId)) {
            //setTimeout(() => this.initializeCarousel(), 100);
          }
        },
        error: (err) => {
          this.error = 'Failed to load deal products';
          this.loading = false;
          console.error(err);
        }
      });
  }

  // private initializeCarousel(): void {
  //   const slickElement = document.querySelector('.deal-slick-carousel');
  //   if (slickElement && (window as any).jQuery) {
  //     (window as any).jQuery(slickElement).slick({
  //       slidesToShow: 4,
  //       slidesToScroll: 1,
  //       infinite: true,
  //       dots: false,
  //       arrows: true,
  //       responsive: [
  //         {
  //           breakpoint: 1024,
  //           settings: { slidesToShow: 3 }
  //         },
  //         {
  //           breakpoint: 768,
  //           settings: { slidesToShow: 2 }
  //         },
  //         {
  //           breakpoint: 480,
  //           settings: { slidesToShow: 1 }
  //         }
  //       ]
  //     });
  //   }
  // }

  ngOnDestroy(): void {
    this.dealProductsSubscription?.unsubscribe();
  }
}