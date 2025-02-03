import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product-service/product.service';
import { CommonModule } from '@angular/common';

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

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    // console.log('fetchProducts function called');
    this.productService.getProducts().subscribe(productData => {
      this.products = productData;  // Assign fetched categories to the categories array
      // console.log(this.products);
    });

    // this.apiService.get<any[]>('api/Product/productList').subscribe({
    //   next: (data) => (this.products = data),
    //   error: (err) => console.error('Error fetching products:', err),
    // });
  }

  ngOnDestroy(): void {
    this.getProductSubscription?.unsubscribe();
  }
}
