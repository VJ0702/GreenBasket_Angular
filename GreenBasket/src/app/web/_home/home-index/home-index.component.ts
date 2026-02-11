import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HomePageSliderComponent } from '../../_shared/home-page-slider/home-page-slider.component';
import { HomeCategoriesComponent } from '../home-categories/home-categories.component';
import { HomeDailyDealsComponent } from '../home-daily-deals/home-daily-deals.component';
import { HomeBannerSectionComponent } from '../home-banner-section/home-banner-section.component';
import { HomePageLatestArrivalComponent } from '../home-page-latest-arrival/home-page-latest-arrival.component';
import { HomeOfferBannerComponent } from '../home-offer-banner/home-offer-banner.component';
import { HomeServiceSectionComponent } from '../home-service-section/home-service-section.component';
import { HomeTrendingSectionComponent } from '../home-trending-section/home-trending-section.component';
import { HomeBlogSectionComponent } from '../home-blog-section/home-blog-section.component';
import { Banner } from '../../../models/home-data/banner';
import { BannerService } from '../../../services/home-data/banner.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home-index',
  standalone: true,
  imports: [CommonModule, HomePageSliderComponent, HomeCategoriesComponent, HomeDailyDealsComponent, HomeBannerSectionComponent,
    HomePageLatestArrivalComponent, HomeOfferBannerComponent, HomeServiceSectionComponent, HomeTrendingSectionComponent, HomeBlogSectionComponent],
  templateUrl: './home-index.component.html',
  styleUrl: './home-index.component.css'
})
export class HomeIndexComponent implements OnInit {
  // Banner Data
  sliderBanners: Banner[] = [];
  midBanners: Banner[] = [];
  offerBanners: Banner[] = [];
  sideBanners: Banner[] = [];

  // Loading & Error States
  isLoadingBanners = true;
  bannerError: string | null = null;
  private isBrowser: boolean;

  constructor(
    private bannerService: BannerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Only load banners in browser to avoid SSR timeout
    if (this.isBrowser) {
      this.loadSliderBanners();
    } else {
      // Set empty state for SSR
      this.isLoadingBanners = false;
    }
  }

  // Load slider banners with caching  
  loadSliderBanners(forceRefresh: boolean = false): void {
    if (!this.isBrowser) return;

    this.isLoadingBanners = true;
    this.bannerError = null;

    this.bannerService.getHomeBanners(forceRefresh).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.sliderBanners = response.data.sliderBanners || [];
          this.midBanners = response.data.midBanners || [];
          this.offerBanners = response.data.offerBanners || [];
          this.sideBanners = response.data.sideBanners || [];
        }
        else {
          this.bannerError = response.message || 'Failed to load banners';
        }
        this.isLoadingBanners = false;
      },
      error: (err) => {
        console.error('Error loading slider banners:', err);
        this.bannerError = 'Failed to load banners. Please try again later.';
        this.isLoadingBanners = false;
      }
    });
  }

  //Retry loading banners   
  retryLoadingBanners(): void {
    this.loadSliderBanners(true); // Force refresh
  }
}
