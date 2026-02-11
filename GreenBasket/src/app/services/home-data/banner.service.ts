import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { ApiService } from '../common-services/api.service';
import { HomeBannersData } from '../../models/home-data/banner';
import { ApiResponse } from '../../models/common/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private endpoint = 'api/Banner';
  private cache: HomeBannersData | null = null;
  private cacheTime: number = 0;
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes cache

  constructor(private apiService: ApiService) { }

  /**
   * Get home banners with caching
   * Reduces API calls for 5 minutes
   */
  getHomeBanners(forceRefresh: boolean = false): Observable<ApiResponse<HomeBannersData>> {
    const now = Date.now();

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.cache && (now - this.cacheTime) < this.cacheExpiry) {
      console.log('Returning cached banner data');
      return of({
        success: true,
        statusCode: 200,
        message: 'Data from cache',
        data: this.cache,
        errorCode: '',
        description: ''
      });
    }

    // Fetch fresh data from API
    console.log('Fetching fresh banner data from API');
    return this.apiService.get<ApiResponse<HomeBannersData>>(`${this.endpoint}/home`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.cache = response.data;
          this.cacheTime = now;
          console.log('Banner data cached successfully');
        }
      }),
      shareReplay(1) // Share the same request if multiple subscribers
    );
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.cache = null;
    this.cacheTime = 0;
    console.log('Banner cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheInfo(): { isCached: boolean; cacheAge: number } {
    const now = Date.now();
    return {
      isCached: this.cache !== null,
      cacheAge: this.cache ? now - this.cacheTime : 0
    };
  }
}