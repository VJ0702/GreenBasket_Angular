import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, OnChanges, PLATFORM_ID, Inject } from '@angular/core';
import { Banner } from '../../../models/home-data/banner';
import { UtilityService } from '../../../services/common-services/utility.service';

@Component({
  selector: 'app-home-offer-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-offer-banner.component.html',
  styleUrl: './home-offer-banner.component.css'
})
export class HomeOfferBannerComponent implements OnChanges {
  @Input() banners: Banner[] = [];
  selectedBanners: Banner[] = [];
  private isBrowser: boolean;

  constructor(
    private utilityService: UtilityService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(): void {
    // Select exactly 2 random banners when banners array changes
    if (this.banners && this.banners.length > 0) {
      this.selectRandomBanners();
    }
  }

  //Select exactly 2 random banners from the array   
  private selectRandomBanners(): void {
    if (this.banners.length <= 2) {
      // If 2 or fewer banners, use all of them
      this.selectedBanners = [...this.banners];
    } else {
      // If more than 2, select 2 random banners
      this.selectedBanners = this.getRandomBanners(this.banners, 2);
    }
  }

  //Get random banners from array   
  private getRandomBanners(array: Banner[], count: number): Banner[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  //Get full image URL using utility service  
  getImageUrl(banner: Banner): string {
    return this.utilityService.getFullImageUrl(banner.imageUrl);
  }

  //Get text alignment with null safety  
  getTextAlignment(banner: Banner): string {
    return banner.textAlignment ? banner.textAlignment.toLowerCase() : 'left';
  }

  //Check if banner has button  
  hasButton(banner: Banner): boolean {
    return !!banner.buttonText;
  }
}