import { Component } from '@angular/core';
import { HomePageSliderComponent } from '../../_shared/home-page-slider/home-page-slider.component';
import { HomeCategoriesComponent } from '../home-categories/home-categories.component';
import { HomeDailyDealsComponent } from '../home-daily-deals/home-daily-deals.component';
import { HomeBannerSectionComponent } from '../home-banner-section/home-banner-section.component';
import { HomePageLatestArrivalComponent } from '../home-page-latest-arrival/home-page-latest-arrival.component';
import { HomeOfferBannerComponent } from '../home-offer-banner/home-offer-banner.component';
import { HomeServiceSectionComponent } from '../home-service-section/home-service-section.component';
import { HomeTrendingSectionComponent } from '../home-trending-section/home-trending-section.component';
import { HomeBlogSectionComponent } from '../home-blog-section/home-blog-section.component';

@Component({
  selector: 'app-home-index',
  standalone: true,
  imports: [HomePageSliderComponent, HomeCategoriesComponent, HomeDailyDealsComponent, HomeBannerSectionComponent,
    HomePageLatestArrivalComponent, HomeOfferBannerComponent, HomeServiceSectionComponent, HomeTrendingSectionComponent, HomeBlogSectionComponent],
  templateUrl: './home-index.component.html',
  styleUrl: './home-index.component.css'
})
export class HomeIndexComponent {

}
