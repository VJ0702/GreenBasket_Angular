import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { Category, CategoryResponse, CategorySearchRequest } from '../../models/category-models/category-search-request';
import { ApiResponse } from '../../models/common/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiService: ApiService) { }
  private categoryEndpoint = 'api/Category/categoryList';
  private categoryDetailEndpoint = 'api/Category/categoryDetail';

  // Get all categories (to use urlHandle)
  getCategories(): Observable<Category[]> {
    return this.apiService
      .get<ApiResponse<CategoryResponse>>(this.categoryEndpoint)
      .pipe(
        map(response => response.data.categories)
      );
  }

  // getCategories(): Observable<any[]> {
  //   return this.apiService.get<any[]>(this.categoryEndpoint);
  // }

  // POST request to get category details
  getCategoryDetails(categorySearchModel: CategorySearchRequest): Observable<any> {
    return this.apiService.post<any>(this.categoryDetailEndpoint, categorySearchModel);
  }
}
