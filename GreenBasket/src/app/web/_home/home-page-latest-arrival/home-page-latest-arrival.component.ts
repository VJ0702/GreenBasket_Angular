import { Component, OnDestroy, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Subscription, forkJoin } from 'rxjs';
import { ProductService } from '../../../services/product-service/product.service';
import { ConfigService } from '../../../services/common-services/config.service';
import { RouterModule } from '@angular/router';
import { UtilityService } from '../../../services/common-services/utility.service';
import { Product, ProductCategory } from '../../../models/product-models/product-details-request';

interface CategoryTab {
  id: string;
  name: string;
  urlHandle: string;
  products: Product[];
}

@Component({
  selector: 'app-home-page-latest-arrival',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page-latest-arrival.component.html',
  styleUrl: './home-page-latest-arrival.component.css'
})
export class HomePageLatestArrivalComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private isBrowser: boolean;

  products: Product[] = [];
  categoryTabs: CategoryTab[] = [];
  activeTab: string = 'all';
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    const sub = this.productService.getProducts().subscribe({
      next: (productData) => {
        // Get first 10 products for "All" tab
        this.products = productData.slice(0, 10);

        // Determine top 3 categories based on product count
        this.buildCategoryTabs(productData);

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  private buildCategoryTabs(allProducts: Product[]): void {
    // Count products per category
    const categoryMap = new Map<string, {
      category: ProductCategory;
      count: number;
      products: Product[]
    }>();

    allProducts.forEach(product => {
      if (product.categories && product.categories.length > 0) {
        // Use the first (primary) category of each product
        const primaryCategory = product.categories[0];
        const key = primaryCategory.urlHandle;

        if (categoryMap.has(key)) {
          const existing = categoryMap.get(key)!;
          existing.count++;
          if (existing.products.length < 10) {
            existing.products.push(product);
          }
        } else {
          categoryMap.set(key, {
            category: primaryCategory,
            count: 1,
            products: [product]
          });
        }
      }
    });

    // Sort categories by product count (descending) and take top 3
    const sortedCategories = Array.from(categoryMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Build category tabs
    this.categoryTabs = sortedCategories.map(item => ({
      id: item.category.urlHandle,
      name: item.category.name,
      urlHandle: item.category.urlHandle,
      products: item.products.slice(0, 10) // Max 10 products per tab
    }));
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getActiveProducts(): Product[] {
    if (this.activeTab === 'all') {
      return this.products;
    }

    const tab = this.categoryTabs.find(t => t.id === this.activeTab);
    return tab ? tab.products : [];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
