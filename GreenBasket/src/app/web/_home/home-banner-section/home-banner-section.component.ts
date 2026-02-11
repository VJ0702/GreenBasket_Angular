import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Banner } from '../../../models/home-data/banner';
import { UtilityService } from '../../../services/common-services/utility.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home-banner-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-banner-section.component.html',
  styleUrl: './home-banner-section.component.css'
})
export class HomeBannerSectionComponent {
  @Input() banners: Banner[] = [];
  selectedBanner: Banner | null = null;
  private isBrowser: boolean;

  constructor(
    private utilityService: UtilityService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(): void {
    // Select a random banner when banners array changes
    if (this.banners && this.banners.length > 0) {
      this.selectRandomBanner();
    }
  }

  /**
   * Select a random banner from the array
   */
  private selectRandomBanner(): void {
    if (this.banners.length === 1) {
      this.selectedBanner = this.banners[0];
    } else if (this.banners.length > 1) {
      const randomIndex = Math.floor(Math.random() * this.banners.length);
      this.selectedBanner = this.banners[randomIndex];
    }
  }

  /**
   * Get full image URL using utility service
   */
  getImageUrl(banner: Banner): string {
    return this.utilityService.getFullImageUrl(banner.imageUrl);
  }

  /**
   * Get text alignment with null safety
   */
  getTextAlignment(banner: Banner): string {
    return banner.textAlignment ? banner.textAlignment.toLowerCase() : 'right';
  }

  /**
   * Check if banner has button
   */
  hasButton(banner: Banner): boolean {
    return !!banner.buttonText;
  }
}
