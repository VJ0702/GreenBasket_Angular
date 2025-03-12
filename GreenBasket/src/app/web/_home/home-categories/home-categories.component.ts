import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../services/common-services/config.service';
import { CategoryService } from '../../../services/category-service/category.service';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css'
})
export class HomeCategoriesComponent implements OnDestroy {
  private getCategorySubscription?: Subscription;
  categories: any[] = [];

  constructor(private configService: ConfigService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe(categoryData => {
      this.categories = categoryData.filter(category => category.parentCategoryId === 0 || category.parentCategoryId === null);  // Filter categories with parentId 0 or null
    });
  }

  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }

  ngOnDestroy(): void {
    this.getCategorySubscription?.unsubscribe();
  }

}
