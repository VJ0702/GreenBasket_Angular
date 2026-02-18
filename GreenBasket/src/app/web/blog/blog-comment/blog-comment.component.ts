import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../services/blog-service/blog.service';
import { AuthService } from '../../../services/auth-service/auth.service';
import { ToastService } from '../../../services/common-services/toast.service';
import { UtilityService } from '../../../services/common-services/utility.service';
import { BlogComment, CreateCommentRequest } from '../../../models/blog-models/blog.model';

@Component({
  selector: 'app-blog-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-comment.component.html',
  styleUrl: './blog-comment.component.css'
})
export class BlogCommentComponent implements OnInit {
  // Input: Blog post ID for submitting comments
  @Input() blogPostId!: number;

  // Input: Existing comments to display
  @Input() comments: BlogComment[] = [];

  // Input: Total comment count
  @Input() commentCount: number = 0;

  // Output: Emit when a new comment is posted successfully
  @Output() commentPosted = new EventEmitter<void>();

  // Form fields
  customerName: string = '';
  customerEmail: string = '';
  commentText: string = '';

  // Reply state
  replyingToCommentId: number | null = null;
  replyingToUserName: string = '';

  // Loading state
  isSubmitting: boolean = false;

  // User info (if logged in)
  isLoggedIn: boolean = false;
  userId: string | null = null;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private toastService: ToastService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    // Check if user is logged in and pre-fill form
    this.isLoggedIn = this.authService.isLoggedIn;
    if (this.isLoggedIn && this.authService.currentUserValue) {
      const user = this.authService.currentUserValue;
      this.userId = user.userId || null;
      this.customerName = `${user.firstName} ${user.lastName}`.trim();
      this.customerEmail = user.email || '';
    }
  }

  /**
   * Start replying to a specific comment
   */
  startReply(comment: BlogComment): void {
    this.replyingToCommentId = comment.id;
    this.replyingToUserName = comment.customerName;
    // Scroll to comment form
    setTimeout(() => {
      const formElement = document.querySelector('.gi-blog-reply-wrapper');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  /**
   * Cancel reply mode
   */
  cancelReply(): void {
    this.replyingToCommentId = null;
    this.replyingToUserName = '';
  }

  /**
   * Submit comment
   */
  submitComment(): void {
    // Validate form
    if (!this.customerName.trim()) {
      this.toastService.warning('Please enter your name');
      return;
    }
    if (!this.customerEmail.trim()) {
      this.toastService.warning('Please enter your email');
      return;
    }
    if (!this.isValidEmail(this.customerEmail)) {
      this.toastService.warning('Please enter a valid email address');
      return;
    }
    if (!this.commentText.trim()) {
      this.toastService.warning('Please enter your comment');
      return;
    }

    this.isSubmitting = true;

    const commentRequest: CreateCommentRequest = {
      blogPostId: this.blogPostId,
      parentCommentId: this.replyingToCommentId,
      customerName: this.customerName.trim(),
      customerEmail: this.customerEmail.trim(),
      commentText: this.commentText.trim(),
      userId: this.userId
    };

    this.blogService.postComment(commentRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.toastService.success(response.message || 'Comment submitted successfully!');
          // Clear form (keep name and email for convenience)
          this.commentText = '';
          this.cancelReply();
          // Emit event to parent to refresh comments if needed
          this.commentPosted.emit();
        } else {
          this.toastService.error(response.message || 'Failed to submit comment');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error posting comment:', err);
        this.toastService.error('Failed to submit comment. Please try again.');
      }
    });
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  getAvatarUrl(avatarUrl: string | null | undefined): string {
    if (avatarUrl) {
      return this.utilityService.getFullImageUrl(avatarUrl);
    }
    return 'images/user/1.jpg';
  }
}
