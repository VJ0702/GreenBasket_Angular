import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { BreadcrumbItem, BreadcrumbConfig } from '../../models/common/breadcrumb.model';

/**
 * Service for managing breadcrumbs across the application.
 * Can be used to dynamically set breadcrumbs from components or
 * automatically generate them based on route data.
 */
@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbConfigSubject = new BehaviorSubject<BreadcrumbConfig | null>(null);
    public breadcrumbConfig$: Observable<BreadcrumbConfig | null> = this.breadcrumbConfigSubject.asObservable();

    private baseUrl: string = '';
    private isBrowser: boolean;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);

        // Set base URL for structured data
        if (this.isBrowser) {
            this.baseUrl = window.location.origin;
        }
    }

    /**
     * Set breadcrumb configuration manually from a component
     * @param config - The breadcrumb configuration
     */
    setBreadcrumbs(config: BreadcrumbConfig): void {
        // Mark the last item as active if not already set
        if (config.items.length > 0) {
            config.items = config.items.map((item, index) => ({
                ...item,
                isActive: item.isActive ?? (index === config.items.length - 1)
            }));
        }
        this.breadcrumbConfigSubject.next(config);
    }

    /**
     * Clear current breadcrumbs
     */
    clearBreadcrumbs(): void {
        this.breadcrumbConfigSubject.next(null);
    }

    /**
     * Get the current breadcrumb configuration
     */
    getCurrentConfig(): BreadcrumbConfig | null {
        return this.breadcrumbConfigSubject.value;
    }

    /**
     * Generate structured data (JSON-LD) for SEO
     * @param items - Array of breadcrumb items
     * @returns JSON-LD string for schema.org BreadcrumbList
     */
    generateStructuredData(items: BreadcrumbItem[]): string {
        const itemListElement = items.map((item, index) => {
            const listItem: any = {
                '@type': 'ListItem',
                'position': index + 1,
                'name': item.label
            };

            // Add URL for non-active items (items with links)
            if (item.url && !item.isActive) {
                let fullUrl = item.url;
                if (!fullUrl.startsWith('http')) {
                    fullUrl = `${this.baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
                }
                // Add query params if present
                if (item.queryParams) {
                    const params = new URLSearchParams(item.queryParams).toString();
                    if (params) {
                        fullUrl += `?${params}`;
                    }
                }
                listItem['item'] = fullUrl;
            }

            return listItem;
        });

        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': itemListElement
        };

        return JSON.stringify(structuredData);
    }

    /**
     * Helper method to create a simple breadcrumb configuration
     * @param pageTitle - The page title
     * @param items - Array of [label, url] tuples, last item's url should be null
     */
    createSimpleBreadcrumbs(pageTitle: string, items: [string, string | null, { [key: string]: string }?][]): BreadcrumbConfig {
        return {
            pageTitle,
            items: items.map(([label, url, queryParams], index) => ({
                label,
                url,
                queryParams,
                isActive: index === items.length - 1
            })),
            includeStructuredData: true
        };
    }

    /**
     * Common breadcrumb patterns for reuse
     */

    // Home only
    static homeOnly(pageTitle: string): BreadcrumbConfig {
        return {
            pageTitle,
            items: [
                { label: 'Home', url: '/', isActive: true }
            ],
            includeStructuredData: true
        };
    }

    // Home > Current Page
    static simplePageBreadcrumb(pageTitle: string, currentPageLabel?: string): BreadcrumbConfig {
        return {
            pageTitle,
            items: [
                { label: 'Home', url: '/' },
                { label: currentPageLabel || pageTitle, url: null, isActive: true }
            ],
            includeStructuredData: true
        };
    }

    // Home > Parent > Current Page
    static withParentBreadcrumb(
        pageTitle: string,
        parentLabel: string,
        parentUrl: string,
        currentPageLabel: string,
        parentQueryParams?: { [key: string]: string }
    ): BreadcrumbConfig {
        return {
            pageTitle,
            items: [
                { label: 'Home', url: '/' },
                { label: parentLabel, url: parentUrl, queryParams: parentQueryParams },
                { label: currentPageLabel, url: null, isActive: true }
            ],
            includeStructuredData: true
        };
    }
}
