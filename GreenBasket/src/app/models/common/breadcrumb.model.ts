// Breadcrumb model interfaces

/**
 * Represents a single breadcrumb item
 */
export interface BreadcrumbItem {
    /** Display label for the breadcrumb */
    label: string;
    /** Route path (use routerLink format). Optional for active/current page items */
    url?: string | null;
    /** Optional query parameters for the route */
    queryParams?: { [key: string]: string };
    /** Whether this is the active/current page (typically the last item) */
    isActive?: boolean;
}

/**
 * Configuration for the breadcrumb component
 */
export interface BreadcrumbConfig {
    /** Page title displayed on the left side */
    pageTitle: string;
    /** Array of breadcrumb items */
    items: BreadcrumbItem[];
    /** Whether to include structured data (JSON-LD) for SEO - defaults to true */
    includeStructuredData?: boolean;
}
