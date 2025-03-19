import { Component, OnInit } from '@angular/core';
import { CategorySearchRequest } from '../../../models/category-models/category-search-request';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category-service/category.service';
import { ConfigService } from '../../../services/common-services/config.service';
import { CommonModule } from '@angular/common';
import { Router } from 'express';
import { CategoryBannerComponent } from '../category-banner/category-banner.component';
import { CategoryPageFilterComponent } from '../category-page-filter/category-page-filter.component';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryBannerComponent, CategoryPageFilterComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit {
  category: any;
  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private configService: ConfigService) { }

  ngOnInit(): void {
    const seName = this.route.snapshot.paramMap.get('seName');
    if (seName) {
      const request: CategorySearchRequest = {
        id: 0,
        name: '',
        slug: seName
      };
      this.getCategoryDetails(request);
    } else {
      console.error('seName parameter is missing');
      // Handle the case where seName is not available
    }
  }

  getCategoryDetails(request: CategorySearchRequest): void {
    this.categoryService.getCategoryDetails(request).subscribe(
      (data) => {
        //console.log('Product details:', data);
        this.category = data;
      },
      (error) => {
        console.error('Error fetching category details', error);
      }
    );
  }

  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }
}
