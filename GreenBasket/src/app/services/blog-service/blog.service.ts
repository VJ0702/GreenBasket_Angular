import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { ApiResponse } from '../../models/common/api-response.model';
import { Blog } from '../../models/blog-models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // API Endpoints
  private readonly recentBlogsEndpoint = 'api/Blog/recent';

  // Cache for recent blogs (shared across components to avoid multiple API calls)
  private recentBlogsCache$: Observable<Blog[]> | null = null;

  constructor(private apiService: ApiService) { }

  /**
   * Get recent blogs for homepage
   * Uses shareReplay to cache the response and avoid multiple API calls
   * This is especially useful for homepage where multiple components might need blog data
   */
  getRecentBlogs(): Observable<Blog[]> {
    if (!this.recentBlogsCache$) {
      this.recentBlogsCache$ = this.apiService
        .get<ApiResponse<Blog[]>>(this.recentBlogsEndpoint)
        .pipe(
          map(response => response.data),
          shareReplay({ bufferSize: 1, refCount: true }) // Cache the result, auto-cleanup when no subscribers
        );
    }
    return this.recentBlogsCache$;
  }

  /**
   * Clear the cache if needed (e.g., after adding a new blog)
   */
  clearCache(): void {
    this.recentBlogsCache$ = null;
  }
}
