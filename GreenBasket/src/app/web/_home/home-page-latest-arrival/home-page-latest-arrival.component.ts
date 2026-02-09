import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../services/common-services/config.service';
import { RouterModule } from '@angular/router';
import { UtilityService } from '../../../services/common-services/utility.service';

@Component({
  selector: 'app-home-page-latest-arrival',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page-latest-arrival.component.html',
  styleUrl: './home-page-latest-arrival.component.css'
})
export class HomePageLatestArrivalComponent implements OnDestroy {
  private getProductSubscription?: Subscription;
  products: any[] = [];

  constructor(private productService: ProductService
    , private configService: ConfigService
    , public utilityService: UtilityService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(productData => {
      //console.log(productData);
      this.products = productData.slice(0, 5);  // Assign fetched categories to the categories array
    });
  }

  // getFullImageUrl(imageUrl: string): string {
  //   return `${this.configService.baseImageUrl}${imageUrl}`;
  // }

  // // Helper method to get filled stars count
  // getFilledStars(rating: number): number[] {
  //   return Array(Math.floor(rating)).fill(0);
  // }

  // // Helper method to check if there's a half star
  // hasHalfStar(rating: number): boolean {
  //   return rating % 1 >= 0.5;
  // }

  // // Helper method to get empty stars count
  // getEmptyStars(rating: number): number[] {
  //   const filledStars = Math.floor(rating);
  //   const hasHalf = this.hasHalfStar(rating);
  //   const emptyCount = 5 - filledStars - (hasHalf ? 1 : 0);
  //   return Array(emptyCount).fill(0);
  // }

  ngOnDestroy(): void {
    this.getProductSubscription?.unsubscribe();
  }
}
