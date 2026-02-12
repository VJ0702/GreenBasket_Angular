import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
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
  private isServer: boolean;

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);

    // Initialize config based on platform
    this.initializeConfig();
  }

  /**
   * Initialize configuration based on platform
   */
  private initializeConfig(): void {
    if (this.isBrowser) {
      // BROWSER: Load from localStorage first (instant), then update in background
      this.loadFromStorage();
      this.loadConfigInBackground();
    } else if (this.isServer) {
      // SSR: Load immediately to render with real data
      // This ensures SEO bots see actual content
      //console.log('🖥️ SSR: Loading site configuration for server-side rendering...');
      this.loadConfig(true).subscribe({
        next: (config) => {
          //console.log('✅ SSR: Site configuration loaded successfully');
        },
        error: (err) => {
          console.error('❌ SSR: Failed to load configuration, using defaults:', err);
          this.configSubject.next(this.getDefaultConfig());
        }
      });
    } else {
      // Fallback for any other platform
      this.configSubject.next(this.getDefaultConfig());
    }
  }

  /**
   * Load configuration from localStorage (instant, no API call)
   * Only works in browser
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
        console.log('💾 Using cached site configuration from localStorage');

        // Check if cache is still valid
        if (now - cacheTime < this.CACHE_DURATION) {
          console.log('✅ Cache is still valid (within 1 hour)');
          return;
        } else {
          console.log('⏰ Cache expired, will fetch fresh data in background');
        }
      } else {
        console.log('📭 No cached configuration found');
        // Set default config immediately
        this.configSubject.next(this.getDefaultConfig());
      }
    } catch (error) {
      console.error('❌ Error loading config from localStorage:', error);
      this.configSubject.next(this.getDefaultConfig());
    }
  }

  /**
   * Load configuration in background (non-blocking)
   * Only works in browser
   */
  private loadConfigInBackground(): void {
    if (!this.isBrowser) return;

    try {
      const timestamp = localStorage.getItem(this.STORAGE_TIMESTAMP_KEY);
      const now = Date.now();

      // Only fetch if cache is expired or doesn't exist
      if (!timestamp || (now - parseInt(timestamp, 10) >= this.CACHE_DURATION)) {
        console.log('🔄 Fetching fresh configuration in background...');
        this.loadConfig(true).subscribe({
          next: () => console.log('✅ Site configuration updated in background'),
          error: (err) => console.error('❌ Failed to update site configuration:', err)
        });
      } else {
        console.log('⏭️ Skipping background fetch, cache is still valid');
      }
    } catch (error) {
      console.error('❌ Error in background config load:', error);
    }
  }

  /**
   * Load configuration with caching
   * @param forceRefresh - Force refresh from API
   */
  loadConfig(forceRefresh: boolean = false): Observable<SiteConfig> {
    // If not forcing refresh and we have cached observable, return it
    if (!forceRefresh && this.configCache$) {
      console.log('📦 Returning cached observable');
      return this.configCache$;
    }

    //console.log('🌐 Making API call to fetch site configuration...');

    this.configCache$ = this.apiService
      .get<ApiResponse<SiteConfig>>(this.endpoint)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            //console.log('✅ API response successful:', response.data);
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
          console.error('❌ Failed to load site configuration:', error);

          // Try to use cached data from localStorage (only in browser)
          if (this.isBrowser) {
            const cached = this.loadFromStorageSync();
            if (cached) {
              console.log('💾 Using stale cache due to API error');
              return of(cached);
            }
          }

          // Fall back to default config
          console.log('🔧 Using default configuration');
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
      console.error('❌ Error saving config to localStorage:', error);
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
      console.error('❌ Error loading config from localStorage:', error);
    }
    return null;
  }

  /**
   * Get current cached config synchronously
   */
  getCurrentConfig(): SiteConfig | null {
    const config = this.configSubject.value;

    // If no config available, return default
    if (!config) {
      return this.getDefaultConfig();
    }

    return config;
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
   * Check if running in browser
   */
  public isBrowserPlatform(): boolean {
    return this.isBrowser;
  }

  /**
   * Check if running in SSR
   */
  public isServerPlatform(): boolean {
    return this.isServer;
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
      phone1: '+91 969 454 9559',
      phone2: '+91 969 454 9559',
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