import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from '../../../services/blog-service/blog.service';
import { UtilityService } from '../../../services/common-services/utility.service';
import { Blog, PaginatedBlogs, BlogCategory } from '../../../models/blog-models/blog.model';
import { BlogSidebarComponent } from '../blog-sidebar/blog-sidebar.component';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';

@Component({
  selector: 'app-all-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, BlogSidebarComponent, BreadcrumbComponent],
  templateUrl: './all-blogs.component.html',
  styleUrl: './all-blogs.component.css'
})
export class AllBlogsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  // Blog data
  blogs: Blog[] = [];
  loading: boolean = true;
  error: string | null = null;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 4;
  totalCount: number = 0;
  totalPages: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;

  // Filters
  searchQuery: string = '';
  selectedCategoryId: number | null = null;
  selectedCategoryName: string = '';
  selectedCategorySlug: string | null = null;

  // Categories for mapping ID to name
  categories: BlogCategory[] = [];

  // Breadcrumb configuration
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    // Initialize default breadcrumbs
    this.updateBreadcrumbs();

    // Load categories first for mapping
    this.loadCategories();

    // Subscribe to query params for category and search filter
    const paramSub = this.route.queryParams.subscribe(params => {
      // Handle search query param
      if (params['search']) {
        this.searchQuery = params['search'];
      } else {
        this.searchQuery = '';
      }

      // Handle category param
      if (params['category']) {
        // Find category ID from slug
        this.findCategoryBySlug(params['category']);
      } else {
        this.selectedCategoryId = null;
        this.selectedCategoryName = '';
        this.selectedCategorySlug = null;
        this.updateBreadcrumbs();
        this.loadBlogs();
      }
    });
    this.subscriptions.push(paramSub);
  }

  /**
   * Update breadcrumbs based on current state
   */
  private updateBreadcrumbs(): void {
    if (this.selectedCategoryName) {
      // With category filter: Home > Blogs > Category Name
      this.breadcrumbItems = [
        { label: 'Home', url: '/' },
        { label: 'Blogs', url: '/blogs' },
        { label: this.selectedCategoryName, url: null, isActive: true }
      ];
    } else {
      // No filter: Home > Blogs
      this.breadcrumbItems = [
        { label: 'Home', url: '/' },
        { label: 'Blogs', url: null, isActive: true }
      ];
    }
  }

  private loadCategories(): void {
    const sub = this.blogService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        // Check if we need to resolve category from URL
        const categorySlug = this.route.snapshot.queryParams['category'];
        if (categorySlug) {
          this.findCategoryBySlug(categorySlug);
        }
      },
      error: (err) => console.error('Error loading categories:', err)
    });
    this.subscriptions.push(sub);
  }

  private findCategoryBySlug(slug: string): void {
    const category = this.categories.find(c => c.urlSlug === slug);
    if (category) {
      this.selectedCategoryId = category.id;
      this.selectedCategoryName = category.name;
      this.selectedCategorySlug = slug;
    } else {
      this.selectedCategoryId = null;
      this.selectedCategoryName = '';
      this.selectedCategorySlug = null;
    }
    this.currentPage = 1;
    this.updateBreadcrumbs();
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    const sub = this.blogService.getBlogList({
      search: this.searchQuery || undefined,
      categoryId: this.selectedCategoryId || undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    }).subscribe({
      next: (response: PaginatedBlogs) => {
        this.blogs = response.posts;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.hasPreviousPage = response.hasPreviousPage;
        this.hasNextPage = response.hasNextPage;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.error = 'Failed to load blogs';
        this.loading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadBlogs();
      // Scroll to top of blog section
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Generate page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis logic
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, -1, this.totalPages); // -1 represents ellipsis
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1, -1, this.totalPages - 2, this.totalPages - 1, this.totalPages);
      } else {
        pages.push(1, -1, this.currentPage, -1, this.totalPages);
      }
    }

    return pages;
  }

  // Sidebar event handlers
  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;

    // Update URL with search param
    const queryParams: any = {};
    if (query && query.trim()) {
      queryParams.search = query.trim();
    }
    if (this.selectedCategorySlug) {
      queryParams.category = this.selectedCategorySlug;
    }
    this.router.navigate(['/blogs'], { queryParams });
  }

  onCategorySelect(categorySlug: string | null): void {
    if (categorySlug) {
      this.router.navigate(['/blogs'], { queryParams: { category: categorySlug } });
    } else {
      this.router.navigate(['/blogs']);
    }
  }

  // Calculate showing range
  get showingStart(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
