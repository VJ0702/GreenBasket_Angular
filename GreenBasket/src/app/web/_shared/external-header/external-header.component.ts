import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../services/common-services/config.service';
import { CategoryService } from '../../../services/category-service/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-external-header',
  standalone: true,
  imports: [CommonModule],
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
    this.categoryService.getCategories().subscribe(categoryData => {
      //console.log(categoryData);
      this.categories = categoryData;  // Assign fetched categories to the categories array
    });
  }

  ngOnDestroy(): void {
    this.getCategorySubscription?.unsubscribe();
  }
}
