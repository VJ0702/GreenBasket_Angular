import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ApiService } from '../common-services/api.service';
import { ApiResponse } from '../../models/common/api-response.model';
import { Blog, BlogDetail, BlogCategory, PaginatedBlogs, BlogListParams, CreateCommentRequest } from '../../models/blog-models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // API Endpoints
  private readonly recentBlogsEndpoint = 'api/Blog/recent';
  private readonly blogDetailEndpoint = 'api/Blog/post';
  private readonly categoriesEndpoint = 'api/Blog/categories';
  private readonly blogListEndpoint = 'api/Blog/list';
  private readonly commentEndpoint = 'api/Blog/comment';

  // Cache for recent blogs (shared across components to avoid multiple API calls)
  private recentBlogsCache$: Observable<Blog[]> | null = null;
  // Cache for categories
  private categoriesCache$: Observable<BlogCategory[]> | null = null;

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
   * Get all blog categories with post count
   * Uses shareReplay to cache the response
   */
  getCategories(): Observable<BlogCategory[]> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.apiService
        .get<ApiResponse<BlogCategory[]>>(this.categoriesEndpoint)
        .pipe(
          map(response => response.data),
          shareReplay({ bufferSize: 1, refCount: true })
        );
    }
    return this.categoriesCache$;
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
   * Get paginated list of blogs with optional filters
   * @param params - Optional filter parameters (search, categoryId, pageNumber, pageSize)
   */
  getBlogList(params?: BlogListParams): Observable<PaginatedBlogs> {
    // Build query string from params
    const queryParams: string[] = [];
    if (params?.search) {
      queryParams.push(`search=${encodeURIComponent(params.search)}`);
    }
    if (params?.categoryId) {
      queryParams.push(`categoryId=${params.categoryId}`);
    }
    if (params?.pageNumber) {
      queryParams.push(`pageNumber=${params.pageNumber}`);
    }
    if (params?.pageSize) {
      queryParams.push(`pageSize=${params.pageSize}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    return this.apiService
      .get<ApiResponse<PaginatedBlogs>>(`${this.blogListEndpoint}${queryString}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Post a comment on a blog post
   * @param comment - The comment data to post
   * @returns Observable with the API response
   */
  postComment(comment: CreateCommentRequest): Observable<ApiResponse<number>> {
    return this.apiService.post<ApiResponse<number>>(this.commentEndpoint, comment);
  }

  /**
   * Clear the cache if needed (e.g., after adding a new blog)
   */
  clearCache(): void {
    this.recentBlogsCache$ = null;
    this.categoriesCache$ = null;
  }
}
