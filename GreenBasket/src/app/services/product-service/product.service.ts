import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { Product, ProductDetail, ProductDetailsRequest, ProductResponse } from '../../models/product-models/product-details-request';
import { ApiResponse } from '../../models/common/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private apiService: ApiService) { }
  // private productEndpoint = 'https://fakestoreapi.com/products';
  private productEndpoint = 'api/Product/productList';
  private productDetailEndpoint = 'api/Product/productDetail';
  private productDetailBySlugEndpoint = 'api/Product/detail-by-slug';

  // // Method to get data from API using HttpClient
  getProducts(): Observable<Product[]> {
    return this.apiService
      .get<ApiResponse<ProductResponse>>(this.productEndpoint)
      .pipe(
        tap(response => {
          //console.log('Full API Response:', response);
          //console.log('Products:', response.data.products);
        }),
        map(response => response.data.products)
      );
  }

  getProductDetails(request: ProductDetailsRequest): Observable<any> {

    return this.apiService.post<any>(this.productDetailEndpoint, request);
  }

  // Get product details by slug using GET
  getProductDetailsBySlug(slug: string): Observable<ProductDetail> {
    return this.apiService
      .get<ApiResponse<ProductDetail>>(`${this.productDetailBySlugEndpoint}/${slug}`)
      .pipe(
        tap(response => {
          console.log('Product Detail Response:', response);
        }),
        map(response => response.data)
      );
  }

}
