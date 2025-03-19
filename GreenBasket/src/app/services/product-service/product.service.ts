import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { ProductDetailsRequest } from '../../models/product-models/product-details-request';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private apiService: ApiService) { }
  // private productEndpoint = 'https://fakestoreapi.com/products';
  private productEndpoint = 'api/Product/productList';
  private productDetailEndpoint = 'api/Product/productDetail';

  // Method to get data from API
  // getProducts(): Observable<any> {
  //   //return this.http.get('https://freetestapi.com/api/v1/products');
  //   return this.http.get('https://fakestoreapi.com/products');  // Calls the GET API
  // }

  // Get all categories (to use urlHandle)
  // getProducts(): Observable<any[]> {
  //   return this.apiService.getByFullUrl<any[]>(this.productEndpoint);
  // }

  // getProducts(): Observable<any[]> {
  //   return this.apiService.get<any[]>(this.productEndpoint);
  // }

  getProducts(): Observable<any[]> {
    return this.apiService.get<any[]>(this.productEndpoint).pipe(
      catchError(error => {
        console.error('Error fetching products:', error.message, error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  getProductDetails(request: ProductDetailsRequest): Observable<any> {

    return this.apiService.post<any>(this.productDetailEndpoint, request);
  }

}
