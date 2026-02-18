import { Component, OnInit } from '@angular/core';
import { CategorySearchRequest } from '../../../models/category-models/category-search-request';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category-service/category.service';
import { ConfigService } from '../../../services/common-services/config.service';
import { CommonModule } from '@angular/common';
import { CategoryBannerComponent } from '../category-banner/category-banner.component';
import { CategoryPageFilterComponent } from '../category-page-filter/category-page-filter.component';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryBannerComponent, CategoryPageFilterComponent, BreadcrumbComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit {
  category: any;
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Loading...', isActive: true }
  ];

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
        this.updateBreadcrumbs();
      },
      (error) => {
        console.error('Error fetching category details', error);
      }
    );
  }

  private updateBreadcrumbs(): void {
    if (this.category) {
      this.breadcrumbItems = [
        { label: 'Home', url: '/' },
        { label: this.category.name, isActive: true }
      ];
    }
  }

  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }
}
