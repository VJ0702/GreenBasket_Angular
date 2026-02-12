export interface SiteConfig {
    siteName: string;
    siteTagline: string;
    logoUrl: string;
    faviconUrl: string;
    phone1: string;
    phone2: string;
    email: string;
    address: string;
    social: SocialConfig;
    seo: SeoConfig;
    header: HeaderConfig;
    footer: FooterConfig;
}

export interface SocialConfig {
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    youTubeUrl: string;
    linkedInUrl: string;
    whatsAppNumber: string;
}

export interface SeoConfig {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalyticsId: string;
}

export interface HeaderConfig {
    tagline: string;
    showSearchBar: boolean;
    showCartIcon: boolean;
    showWishlistIcon: boolean;
}

export interface FooterConfig {
    copyright: string;
    aboutText: string;
}