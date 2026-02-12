import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { ApiService } from '../common-services/api.service';
import { Banner, BannerCache, BannerType, HomeBannersData } from '../../models/home-data/banner';
import { ApiResponse } from '../../models/common/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private endpoint = 'api/Banner';
  private cache: HomeBannersData | null = null;
  private cacheTime: number = 0;

  // Cache for individual banner types
  private typeCaches: Map<string, BannerCache> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes cache

  constructor(private apiService: ApiService) { }

  //Get home banners with caching
  //Reduces API calls for 5 minutes
  getHomeBanners(forceRefresh: boolean = false): Observable<ApiResponse<HomeBannersData>> {
    const now = Date.now();

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.cache && (now - this.cacheTime) < this.cacheExpiry) {
      //console.log('Returning cached banner data');
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
    //console.log('Fetching fresh banner data from API');
    return this.apiService.get<ApiResponse<HomeBannersData>>(`${this.endpoint}/home`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.cache = response.data;
          this.cacheTime = now;
          //console.log('Banner data cached successfully');
        }
      }),
      shareReplay(1) // Share the same request if multiple subscribers
    );
  }


  /**
   * Get banners by type with caching and optional limit
   * @param bannerType - Type of banner to fetch
   * @param limit - Optional limit on number of banners (default: no limit)
   * @param forceRefresh - Force refresh from API
   */
  getBannersByType(
    bannerType: BannerType | string,
    limit?: number,
    forceRefresh: boolean = false
  ): Observable<ApiResponse<Banner[]>> {
    const now = Date.now();
    const cacheKey = `${bannerType}${limit ? `_limit_${limit}` : ''}`;

    // Check cache first
    if (!forceRefresh) {
      const cached = this.typeCaches.get(cacheKey);
      if (cached && (now - cached.timestamp) < this.cacheExpiry) {
        //console.log(`Returning cached data for ${bannerType}${limit ? ` (limit: ${limit})` : ''}`);
        return of({
          success: true,
          statusCode: 200,
          message: 'Data from cache',
          data: cached.data,
          errorCode: '',
          description: ''
        });
      }
    }

    // Build URL with optional limit parameter
    let url = `${this.endpoint}/type/${bannerType}`;
    if (limit && limit > 0) {
      url += `?limit=${limit}`;
    }

    //console.log(`Fetching fresh data for ${bannerType}${limit ? ` (limit: ${limit})` : ''}`);

    // Fetch from API
    return this.apiService.get<ApiResponse<Banner[]>>(url).pipe(
      tap(response => {
        if (response.success && response.data) {
          // Cache the response
          this.typeCaches.set(cacheKey, {
            data: response.data,
            timestamp: now
          });
          //console.log(`Cached ${bannerType} data successfully`);
        }
      }),
      shareReplay(1)
    );
  }

  //Get slider banners with optional limit
  getSliderBanners(limit?: number, forceRefresh: boolean = false): Observable<ApiResponse<Banner[]>> {
    return this.getBannersByType(BannerType.HomeSliderBanner, limit, forceRefresh);
  }

  //Get mid banners with optional limit
  getMidBanners(limit?: number, forceRefresh: boolean = false): Observable<ApiResponse<Banner[]>> {
    return this.getBannersByType(BannerType.HomeMidBanner, limit, forceRefresh);
  }

  //Get offer banners with optional limit   
  getOfferBanners(limit?: number, forceRefresh: boolean = false): Observable<ApiResponse<Banner[]>> {
    return this.getBannersByType(BannerType.HomeOfferBanner, limit, forceRefresh);
  }

  //Get side banners with optional limit   
  getSideBanners(limit?: number, forceRefresh: boolean = false): Observable<ApiResponse<Banner[]>> {
    return this.getBannersByType(BannerType.HomeSideBanner, limit, forceRefresh);
  }

  //Clear cache manually  
  clearCache(): void {
    this.cache = null;
    this.cacheTime = 0;
    this.typeCaches.clear();
    console.log('Banner cache cleared');
  }

  //Clear cache for specific banner type   
  clearTypeCache(bannerType: BannerType | string, limit?: number): void {
    const cacheKey = `${bannerType}${limit ? `_limit_${limit}` : ''}`;
    this.typeCaches.delete(cacheKey);
    //console.log(`Cache cleared for ${cacheKey}`);
  }

  //Get cache status for all types
  getCacheInfo(): {
    home: { isCached: boolean; cacheAge: number };
    types: Map<string, { isCached: boolean; cacheAge: number }>;
  } {
    const now = Date.now();

    const typesInfo = new Map<string, { isCached: boolean; cacheAge: number }>();
    this.typeCaches.forEach((cache, key) => {
      typesInfo.set(key, {
        isCached: true,
        cacheAge: now - cache.timestamp
      });
    });

    return {
      home: {
        isCached: this.cache !== null,
        cacheAge: this.cache ? now - this.cacheTime : 0
      },
      types: typesInfo
    };
  }

  //Check if cache is expired for a specific type   
  isCacheExpired(bannerType: BannerType | string, limit?: number): boolean {
    const cacheKey = `${bannerType}${limit ? `_limit_${limit}` : ''}`;
    const cached = this.typeCaches.get(cacheKey);

    if (!cached) return true;

    const now = Date.now();
    return (now - cached.timestamp) >= this.cacheExpiry;
  }

  //Get cache status
  // getCacheInfo(): { isCached: boolean; cacheAge: number } {
  //   const now = Date.now();
  //   return {
  //     isCached: this.cache !== null,
  //     cacheAge: this.cache ? now - this.cacheTime : 0
  //   };
  // }
}