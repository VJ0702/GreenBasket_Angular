import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BlogService } from '../../../services/blog-service/blog.service';
import { Blog } from '../../../models/blog-models/blog.model';

@Component({
  selector: 'app-home-blog-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-blog-section.component.html',
  styleUrl: './home-blog-section.component.css'
})
export class HomeBlogSectionComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  blogs: Blog[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchRecentBlogs();
  }

  private fetchRecentBlogs(): void {
    const sub = this.blogService.getRecentBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
        this.cdr.markForCheck();

        // Debug: Log fetched blogs
        //console.log('Recent Blogs fetched:', this.blogs);
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
        this.error = 'Failed to load blogs';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
