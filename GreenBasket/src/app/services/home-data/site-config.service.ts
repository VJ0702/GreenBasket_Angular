import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, shareReplay, catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../../models/common/api-response.model';
import { ApiService } from '../common-services/api.service';
import { SiteConfig } from '../../models/home-data/site-config';

@Injectable({
  providedIn: 'root'
})
export class SiteConfigService {
  private configCache$?: Observable<SiteConfig>;
  private configSubject = new BehaviorSubject<SiteConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache
  private readonly STORAGE_KEY = 'greenbasket_site_config';
  private readonly STORAGE_TIMESTAMP_KEY = 'greenbasket_site_config_timestamp';
  private readonly endpoint = 'api/Settings/config';

  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Only use localStorage in browser environment
    if (this.isBrowser) {
      // Load from localStorage immediately (synchronous, no blocking)
      this.loadFromStorage();

      // Then fetch fresh data in background (non-blocking)
      this.loadConfigInBackground();
    } else {
      // In SSR, use default config and fetch fresh data
      this.configSubject.next(this.getDefaultConfig());
      this.loadConfig(true).subscribe();
    }
  }

  /**
   * Load configuration from localStorage (instant, no API call)
   */
  private loadFromStorage(): void {
    if (!this.isBrowser) return;

    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      const timestamp = localStorage.getItem(this.STORAGE_TIMESTAMP_KEY);

      if (cached && timestamp) {
        const config = JSON.parse(cached);
        const cacheTime = parseInt(timestamp, 10);
        const now = Date.now();

        // Use cached data immediately (even if expired, we'll update in background)
        this.configSubject.next(config);

        // Check if cache is still valid
        if (now - cacheTime < this.CACHE_DURATION) {
          //console.log('✅ Using cached site configuration from localStorage');
          return;
        }
      }
    } catch (error) {
      console.error('Error loading config from localStorage:', error);
    }
  }

  /**
   * Load configuration in background (non-blocking)
   */
  private loadConfigInBackground(): void {
    if (!this.isBrowser) return;

    const timestamp = localStorage.getItem(this.STORAGE_TIMESTAMP_KEY);
    const now = Date.now();

    // Only fetch if cache is expired or doesn't exist
    if (!timestamp || (now - parseInt(timestamp, 10) >= this.CACHE_DURATION)) {
      this.loadConfig(true).subscribe({
        next: () => console.log('✅ Site configuration updated in background'),
        error: (err) => console.error('❌ Failed to update site configuration:', err)
      });
    }
  }

  /**
   * Load configuration with caching
   * @param forceRefresh - Force refresh from API
   */
  loadConfig(forceRefresh: boolean = false): Observable<SiteConfig> {
    // If not forcing refresh and we have cached observable, return it
    if (!forceRefresh && this.configCache$) {
      return this.configCache$;
    }

    this.configCache$ = this.apiService
      .get<ApiResponse<SiteConfig>>(this.endpoint)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to load configuration');
        }),
        tap(config => {
          // Update BehaviorSubject
          this.configSubject.next(config);

          // Save to localStorage for future use (only in browser)
          if (this.isBrowser) {
            this.saveToStorage(config);
          }
        }),
        catchError(error => {
          console.error('Failed to load site configuration:', error);

          // Try to use cached data from localStorage (only in browser)
          if (this.isBrowser) {
            const cached = this.loadFromStorageSync();
            if (cached) {
              return of(cached);
            }
          }

          // Fall back to default config
          return of(this.getDefaultConfig());
        }),
        shareReplay(1)
      );

    return this.configCache$;
  }

  /**
   * Save configuration to localStorage
   */
  private saveToStorage(config: SiteConfig): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      localStorage.setItem(this.STORAGE_TIMESTAMP_KEY, Date.now().toString());
      console.log('💾 Site configuration saved to localStorage');
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
  }

  /**
   * Load configuration from localStorage synchronously
   */
  private loadFromStorageSync(): SiteConfig | null {
    if (!this.isBrowser) return null;

    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error loading config from localStorage:', error);
    }
    return null;
  }

  /**
   * Get current cached config synchronously
   */
  getCurrentConfig(): SiteConfig | null {
    return this.configSubject.value;
  }

  /**
   * Get site name
   */
  getSiteName(): string {
    return this.configSubject.value?.siteName || 'GreenBasket';
  }

  /**
   * Get site tagline
   */
  getSiteTagline(): string {
    return this.configSubject.value?.siteTagline || "India's Largest Organic Fruits & Vegs Store";
  }

  /**
   * Get contact information
   */
  getContactInfo() {
    const config = this.configSubject.value;
    return {
      phone1: config?.phone1 || '',
      phone2: config?.phone2 || '',
      email: config?.email || '',
      address: config?.address || ''
    };
  }

  /**
   * Get social media links
   */
  getSocialLinks() {
    return this.configSubject.value?.social || this.getDefaultConfig().social;
  }

  /**
   * Get SEO configuration
   */
  getSeoConfig() {
    return this.configSubject.value?.seo || this.getDefaultConfig().seo;
  }

  /**
   * Get header configuration
   */
  getHeaderConfig() {
    return this.configSubject.value?.header || this.getDefaultConfig().header;
  }

  /**
   * Get footer configuration
   */
  getFooterConfig() {
    return this.configSubject.value?.footer || this.getDefaultConfig().footer;
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    if (!this.isBrowser) return;

    this.configCache$ = undefined;
    this.configSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_TIMESTAMP_KEY);
    console.log('🗑️ Site configuration cache cleared');
  }

  /**
   * Refresh configuration manually
   */
  refreshConfig(): Observable<SiteConfig> {
    this.configCache$ = undefined;
    return this.loadConfig(true);
  }

  /**
   * Default configuration fallback
   */
  private getDefaultConfig(): SiteConfig {
    return {
      siteName: 'GreenBasket',
      siteTagline: "India's Largest Organic Fruits & Vegs Store",
      logoUrl: '',
      faviconUrl: '',
      phone1: '',
      phone2: '',
      email: 'support@greenbasket.com',
      address: '',
      social: {
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        youTubeUrl: '',
        linkedInUrl: '',
        whatsAppNumber: ''
      },
      seo: {
        metaTitle: 'GreenBasket - Organic Fruits & Vegetables',
        metaDescription: 'Shop fresh organic fruits and vegetables online',
        metaKeywords: 'organic, fruits, vegetables, grocery',
        googleAnalyticsId: ''
      },
      header: {
        tagline: "India's Largest Organic Fruits & Vegs Store",
        showSearchBar: true,
        showCartIcon: true,
        showWishlistIcon: true
      },
      footer: {
        copyright: '© 2026 GreenBasket. All rights reserved.',
        aboutText: ''
      }
    };
  }
}