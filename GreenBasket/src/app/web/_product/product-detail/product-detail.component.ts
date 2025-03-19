import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { ProductDetailsRequest } from '../../../models/product-models/product-details-request';
import { ConfigService } from '../../../services/common-services/config.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'] // Corrected property name
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    const seName = this.route.snapshot.paramMap.get('seName');
    if (seName) {
      const request: ProductDetailsRequest = {
        id: 0,
        name: '',
        slug: seName
      };
      this.getProductDetails(request);
    } else {
      console.error('seName parameter is missing');
      // Handle the case where seName is not available
    }
  }

  getProductDetails(request: ProductDetailsRequest): void {
    this.productService.getProductDetails(request).subscribe(
      (data) => {
        //console.log('Product details:', data);
        this.product = data;
      },
      (error) => {
        console.error('Error fetching product details', error);
      }
    );
  }

  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }

  activateReviewTab(event: Event): void {

    console.log('Activating review tab  ' + event);
    event.preventDefault();
    const reviewTab = document.querySelector('#review-tab');
    const reviewTabContent = document.querySelector('#gi-spt-nav-review');
    if (reviewTab && reviewTabContent) {
      // Activate the tab
      (reviewTab as HTMLElement).classList.add('active');
      (reviewTabContent as HTMLElement).classList.add('show', 'active');

      // Deactivate other tabs
      const otherTabs = document.querySelectorAll('.nav-link');
      const otherTabContents = document.querySelectorAll('.tab-pane');
      otherTabs.forEach(tab => {
        if (tab !== reviewTab) {
          (tab as HTMLElement).classList.remove('active');
        }
      });
      otherTabContents.forEach(tabContent => {
        if (tabContent !== reviewTabContent) {
          (tabContent as HTMLElement).classList.remove('show', 'active');
        }
      });
    }
  }
}