import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { BlogService } from '../../../services/blog-service/blog.service';
import { UtilityService } from '../../../services/common-services/utility.service';
import { BlogDetail } from '../../../models/blog-models/blog.model';
import { BlogSidebarComponent } from '../blog-sidebar/blog-sidebar.component';
import { BlogCommentComponent } from '../blog-comment/blog-comment.component';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterModule, BlogSidebarComponent, BlogCommentComponent, BreadcrumbComponent],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  blog: BlogDetail | null = null;
  sanitizedBody: SafeHtml | null = null;
  loading: boolean = true;
  error: string | null = null;

  // Breadcrumb configuration
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    public utilityService: UtilityService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Initialize default breadcrumbs
    this.breadcrumbItems = [
      { label: 'Home', url: '/' },
      { label: 'Blogs', url: '/blogs' },
      { label: 'Loading...', url: null, isActive: true }
    ];

    // Subscribe to route params to get the blog slug
    const routeSub = this.route.params.subscribe(params => {
      const slug = params['urlSlug'];
      if (slug) {
        this.fetchBlogDetails(slug);
      }
    });
    this.subscriptions.push(routeSub);
  }

  private fetchBlogDetails(slug: string): void {
    this.loading = true;
    this.error = null;

    const sub = this.blogService.getBlogBySlug(slug).subscribe({
      next: (blog) => {
        this.blog = blog;
        // Bypass security for trusted HTML content from API
        this.sanitizedBody = this.sanitizer.bypassSecurityTrustHtml(blog.body || '');

        // Update breadcrumbs with actual blog title
        this.breadcrumbItems = [
          { label: 'Home', url: '/' },
          { label: 'Blogs', url: '/blogs' },
          { label: blog.title, url: null, isActive: true }
        ];

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching blog details:', err);
        this.error = 'Failed to load blog details';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Format date for display (e.g., "Feb 16, 2026")
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Handle search from sidebar - navigate to all-blogs with search query
   */
  onSearch(query: string): void {
    if (query && query.trim()) {
      this.router.navigate(['/blogs'], { queryParams: { search: query.trim() } });
    }
  }

  /**
   * Handle category selection from sidebar - navigate to all-blogs with category filter
   */
  onCategorySelect(categorySlug: string | null): void {
    if (categorySlug) {
      this.router.navigate(['/blogs'], { queryParams: { category: categorySlug } });
    } else {
      this.router.navigate(['/blogs']);
    }
  }

  /**
   * Refresh blog details after a comment is posted
   */
  onCommentPosted(): void {
    if (this.blog) {
      this.fetchBlogDetails(this.blog.urlSlug);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
