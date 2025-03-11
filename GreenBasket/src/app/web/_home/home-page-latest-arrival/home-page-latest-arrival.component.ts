import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../services/common-services/config.service';

@Component({
  selector: 'app-home-page-latest-arrival',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page-latest-arrival.component.html',
  styleUrl: './home-page-latest-arrival.component.css'
})
export class HomePageLatestArrivalComponent implements OnDestroy {
  private getProductSubscription?: Subscription;
  products: any[] = [];

  constructor(private productService: ProductService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(productData => {
      //console.log(productData);
      this.products = productData;  // Assign fetched categories to the categories array
    });
  }

  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }

  ngOnDestroy(): void {
    this.getProductSubscription?.unsubscribe();
  }
}
