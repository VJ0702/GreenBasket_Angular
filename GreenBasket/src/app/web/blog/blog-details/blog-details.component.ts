import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from '../../../services/blog-service/blog.service';
import { UtilityService } from '../../../services/common-services/utility.service';
import { BlogDetail } from '../../../models/blog-models/blog.model';
import { BlogSidebarComponent } from '../blog-sidebar/blog-sidebar.component';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterModule, BlogSidebarComponent],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  blog: BlogDetail | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    public utilityService: UtilityService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
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
        this.loading = false;
        this.cdr.markForCheck();
        //console.log('Blog details fetched:', this.blog);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
