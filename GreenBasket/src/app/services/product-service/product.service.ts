import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../common-services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private apiService: ApiService) { }
  private productEndpoint = 'https://fakestoreapi.com/products';

  // Method to get data from API
  // getProducts(): Observable<any> {
  //   //return this.http.get('https://freetestapi.com/api/v1/products');
  //   return this.http.get('https://fakestoreapi.com/products');  // Calls the GET API
  // }

  // Get all categories (to use urlHandle)
  getProducts(): Observable<any[]> {
    return this.apiService.getByFullUrl<any[]>(this.productEndpoint);
  }
}
