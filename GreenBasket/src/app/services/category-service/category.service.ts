import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { CategorySearchRequest } from '../../models/category-models/category-search-request';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiService: ApiService) { }
  private categoryEndpoint = 'api/Category/categoryList';
  private categoryDetailEndpoint = 'api/Category/categoryDetail';

  // Get all categories (to use urlHandle)
  getCategories(): Observable<any[]> {
    return this.apiService.get<any[]>(this.categoryEndpoint);
  }

  // POST request to get category details
  getCategoryDetails(categorySearchModel: CategorySearchRequest): Observable<any> {
    return this.apiService.post<any>(this.categoryDetailEndpoint, categorySearchModel);
  }
}
