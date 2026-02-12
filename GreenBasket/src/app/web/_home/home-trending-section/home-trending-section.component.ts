import { Component, OnDestroy } from '@angular/core';
import { BannerService } from '../../../services/home-data/banner.service';
import { UtilityService } from '../../../services/common-services/utility.service';
import { Banner } from '../../../models/home-data/banner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-trending-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-trending-section.component.html',
  styleUrl: './home-trending-section.component.css'
})
export class HomeTrendingSectionComponent implements OnDestroy {
  // Single banner object (not array)
  selectedBanner: Banner | null = null;
  banners: Banner[] = [];

  constructor(private bannerService: BannerService,
    public utilityService: UtilityService) { }

  ngOnInit(): void {
    this.fetchSideBanner();
  }


  fetchSideBanner(): void {

    // Fetch only 1 side banner for optimization
    this.bannerService.getSideBanners(1).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Check if data has banners array (nested structure)
          const bannersArray = (response.data as any).banners || response.data;

          //console.log('Banners array:', bannersArray);

          if (Array.isArray(bannersArray) && bannersArray.length > 0) {
            // Get first banner from array
            this.selectedBanner = bannersArray[0];
            //console.log('✅ Selected side banner:', this.selectedBanner);
          } else if (!Array.isArray(bannersArray) && bannersArray) {
            // If data itself is a single banner object
            this.selectedBanner = bannersArray;
            //console.log('✅ Selected side banner (direct):', this.selectedBanner);
          } else {
            console.log('❌ No side banners available');
            this.selectedBanner = null;
          }
        } else {
          console.log('❌ Response not successful or no data');
          this.selectedBanner = null;
        }
      },
      error: (err) => {
        console.error('❌ Error fetching side banner:', err);
        this.selectedBanner = null;
      }
    });
  }


  //Alternative: Fetch multiple and randomly select one   
  fetchRandomSideBanner(): void {
    console.log('🔄 Fetching random side banner from multiple...');

    // Fetch up to 5 side banners and pick one randomly
    this.bannerService.getSideBanners(5).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const bannersArray = (response.data as any).banners || response.data;

          if (Array.isArray(bannersArray) && bannersArray.length > 0) {
            // Randomly select one banner
            const randomIndex = Math.floor(Math.random() * bannersArray.length);
            this.selectedBanner = bannersArray[randomIndex];
            console.log('✅ Selected random side banner:', this.selectedBanner);
          } else {
            console.log('❌ No side banners available');
            this.selectedBanner = null;
          }
        } else {
          console.log('❌ Response not successful or no data');
          this.selectedBanner = null;
        }
      },
      error: (err) => {
        console.error('❌ Error fetching side banners:', err);
        this.selectedBanner = null;
      }
    });
  }

  //Get text alignment with null safety  
  getTextAlignment(banner: Banner): string {
    return banner.textAlignment ? banner.textAlignment.toLowerCase() : 'left';
  }
  //Check if banner has button  
  hasButton(banner: Banner): boolean {
    return !!banner.buttonText;
  }

  ngOnDestroy(): void {
  }
}
