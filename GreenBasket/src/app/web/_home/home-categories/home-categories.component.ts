import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../services/common-services/config.service';
import { CategoryService } from '../../../services/category-service/category.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css'
})
export class HomeCategoriesComponent implements OnDestroy {
  private getCategorySubscription?: Subscription;
  categories: any[] = [];
  loading = false;

  constructor(private configService: ConfigService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    // this.categoryService.getCategories().subscribe(categoryData => {
    //   this.categories = categoryData.filter(category => category.parentCategoryId === 0 || category.parentCategoryId === null);  // Filter categories with parentId 0 or null
    // });
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error in loading categories ', err);
        this.loading = false;
      }
    });
  }

  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }

  ngOnDestroy(): void {
    this.getCategorySubscription?.unsubscribe();
  }

}
