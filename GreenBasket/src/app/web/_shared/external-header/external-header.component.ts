import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../services/common-services/config.service';
import { CategoryService } from '../../../services/category-service/category.service';
import { CommonModule } from '@angular/common';
import { CategoryMenuItemComponent } from '../category-menu-item/category-menu-item.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-external-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryMenuItemComponent],
  templateUrl: './external-header.component.html',
  styleUrl: './external-header.component.css'
})
export class ExternalHeaderComponent implements OnDestroy {
  private getCategorySubscription?: Subscription;
  categories: any[] = [];

  constructor(private confifService: ConfigService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.log('Error in loading categories ', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.getCategorySubscription?.unsubscribe();
  }
}
