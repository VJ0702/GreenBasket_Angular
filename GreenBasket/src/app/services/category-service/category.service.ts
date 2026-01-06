import { Injectable } from '@angular/core';
import { map, Observable, of, shareReplay, tap } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { Category, CategoryResponse, CategorySearchRequest } from '../../models/category-models/category-search-request';
import { ApiResponse } from '../../models/common/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesCache$?: Observable<Category[]>;
  private cacheTimestamp?: number;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private apiService: ApiService) { }
  private categoryEndpoint = 'api/Category/categoryList';
  private categoryDetailEndpoint = 'api/Category/categoryDetail';

  // Get all categories with caching (to use urlHandle)
  getCategories(): Observable<Category[]> {
    const now = Date.now();

    // Return cached data if available and not expired
    if (this.categoriesCache$ && this.cacheTimestamp && (now - this.cacheTimestamp < this.CACHE_DURATION)) {
      //console.log('Returning cached categories');
      return this.categoriesCache$;
    }

    // Fetch fresh data and cache it
    //console.log('Fetching fresh categories from API');
    this.cacheTimestamp = now;
    this.categoriesCache$ = this.apiService
      .get<ApiResponse<CategoryResponse>>(this.categoryEndpoint)
      .pipe(
        map(response => response.data.categories),
        shareReplay(1) // Share the same result with all subscribers
      );

    return this.categoriesCache$;
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.categoriesCache$ = undefined;
    this.cacheTimestamp = undefined;
  }

  // getCategories(): Observable<any[]> {
  //   return this.apiService.get<any[]>(this.categoryEndpoint);
  // }

  // POST request to get category details
  getCategoryDetails(categorySearchModel: CategorySearchRequest): Observable<any> {
    return this.apiService.post<any>(this.categoryDetailEndpoint, categorySearchModel);
  }
}
