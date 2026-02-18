import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfigService } from '../../../services/home-data/site-config.service';
import { CategoryService } from '../../../services/category-service/category.service';
import { ConfigService } from '../../../services/common-services/config.service';
import { SiteConfig } from '../../../models/home-data/site-config';
import { Category } from '../../../models/category-models/category-search-request';
import { UtilityService } from '../../../services/common-services/utility.service';

@Component({
  selector: 'app-external-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './external-footer.component.html',
  styleUrl: './external-footer.component.css'
})
export class ExternalFooterComponent implements OnInit, OnDestroy {
  siteConfig: SiteConfig | null = null;
  footerCategories: Category[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private siteConfigService: SiteConfigService,
    private categoryService: CategoryService,
    private configService: ConfigService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    // Subscribe to cached site config (already loaded by service)
    this.subscriptions.push(
      this.siteConfigService.config$.subscribe(config => {
        this.siteConfig = config;
      })
    );

    // Get cached categories and filter for footer
    this.subscriptions.push(
      this.categoryService.getCategories().subscribe(categories => {
        this.footerCategories = categories.filter(cat => cat.includeInFooter && cat.isActive).slice(0, 6); // Limit to 5 categories for footer
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  //Get full image URL for logo and other images   
  getFullImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'images/logo/logo.png';
    else return this.utilityService.getFullImageUrl(imageUrl);
  }

  //Get WhatsApp link with proper formatting   
  getWhatsAppLink(): string {
    const number = this.siteConfig?.social?.whatsAppNumber?.replace(/[^0-9]/g, '') || '';
    return `https://wa.me/${number}`;
  }

  //Get current year for copyright   
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
