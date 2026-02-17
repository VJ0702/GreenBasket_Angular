import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { ApiResponse } from '../../models/common/api-response.model';
import { Blog, BlogDetail } from '../../models/blog-models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // API Endpoints
  private readonly recentBlogsEndpoint = 'api/Blog/recent';
  private readonly blogDetailEndpoint = 'api/Blog/post';

  // Cache for recent blogs (shared across components to avoid multiple API calls)
  private recentBlogsCache$: Observable<Blog[]> | null = null;

  constructor(private apiService: ApiService) { }

  /**
   * Get recent blogs for homepage and sidebar
   * Uses shareReplay to cache the response and avoid multiple API calls
   */
  getRecentBlogs(): Observable<Blog[]> {
    if (!this.recentBlogsCache$) {
      this.recentBlogsCache$ = this.apiService
        .get<ApiResponse<Blog[]>>(this.recentBlogsEndpoint)
        .pipe(
          map(response => response.data),
          shareReplay({ bufferSize: 1, refCount: true })
        );
    }
    return this.recentBlogsCache$;
  }

  /**
   * Get blog details by slug
   * @param slug - The URL slug of the blog post
   */
  getBlogBySlug(slug: string): Observable<BlogDetail> {
    return this.apiService
      .get<ApiResponse<BlogDetail>>(`${this.blogDetailEndpoint}/${slug}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Clear the cache if needed (e.g., after adding a new blog)
   */
  clearCache(): void {
    this.recentBlogsCache$ = null;
  }
}
