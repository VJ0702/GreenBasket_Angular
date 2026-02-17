import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BlogService } from '../../../services/blog-service/blog.service';
import { Blog, BlogCategory } from '../../../models/blog-models/blog.model';
import { BlogCardComponent } from '../blog-card/blog-card.component';

@Component({
  selector: 'app-blog-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BlogCardComponent],
  templateUrl: './blog-sidebar.component.html',
  styleUrl: './blog-sidebar.component.css'
})
export class BlogSidebarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  // Optional: Currently selected category (for filtering)
  @Input() selectedCategorySlug: string | null = null;

  // Emit search query
  @Output() searchQueryChange = new EventEmitter<string>();

  // Emit category selection
  @Output() categorySelect = new EventEmitter<string | null>();

  recentBlogs: Blog[] = [];
  categories: BlogCategory[] = [];
  searchQuery: string = '';
  loadingBlogs: boolean = true;
  loadingCategories: boolean = true;

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.fetchRecentBlogs();
    this.fetchCategories();
  }

  private fetchRecentBlogs(): void {
    const sub = this.blogService.getRecentBlogs().subscribe({
      next: (blogs) => {
        this.recentBlogs = blogs;
        this.loadingBlogs = false;
      },
      error: (err) => {
        console.error('Error fetching recent blogs:', err);
        this.loadingBlogs = false;
      }
    });
    this.subscriptions.push(sub);
  }

  private fetchCategories(): void {
    const sub = this.blogService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loadingCategories = false;
      }
    });
    this.subscriptions.push(sub);
  }

  onSearch(): void {
    this.searchQueryChange.emit(this.searchQuery);
  }

  onCategorySelect(categorySlug: string | null): void {
    this.selectedCategorySlug = categorySlug;
    this.categorySelect.emit(categorySlug);
  }

  isCategorySelected(categorySlug: string): boolean {
    return this.selectedCategorySlug === categorySlug;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
