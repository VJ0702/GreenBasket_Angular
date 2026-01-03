import { DecimalPipe } from "@angular/common";

export interface ProductDetailsRequest {
    id: number;
    name: string;
    slug: string;
}


export interface ProductRating {
    averageRating: number;
    reviewCount: number;
    approvedCount: number;
    notApprovedCount: number;
}

export interface ProductCategory {
    id: number;
    name: string;
    description: string;
    urlHandle: string;
    parentCategoryId: number;
    parentCategoryName: string | null;
    categoryImageUrl: string | null;
}

export interface Product {
    id: number;
    name: string;
    shortDescription: string;
    sku: string;
    price: number;
    oldPrice: number | null;
    showOnHomepage: boolean;
    stockQuantity: number;
    published: boolean;
    urlHandle: string;
    primaryImageUrl: string;
    rating: ProductRating;
    categories: ProductCategory[];
    createdOnUtc: string;
}

export interface ProductResponse {
    products: Product[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}



export interface ProductVariant {
    id: number;
    variantName: string;
    unit: string;
    sku: string;
    mrp: number;
    price: number;
    taxPercent: number;
    published: boolean;
}

export interface ProductDetail {
    id: number;
    name: string;
    shortDescription: string;
    fullDescription: string;
    sku: string;
    price: number;
    oldPrice: number | null;
    stockQuantity: number;
    showOnHomepage: boolean;
    published: boolean;
    urlHandle: string;
    images: ProductImage[];
    rating: ProductRating;
    reviews: ProductReview[];
    categories: ProductCategory[];
    variants: ProductVariant[];
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    createdOnUtc: string;
    updatedOnUtc: string;
}

export interface ProductReview {
    id: number;
    title: string;
    reviewText: string;
    rating: number;
    reviewerName: string;
    createdOnUtc: string;
    isApproved: boolean;
}

export interface ProductImage {
    id: number;
    url: string;
    altAttribute: string;
    titleAttribute: string;
    mimeType: string;
    seoFilename: string;
    displayOrder: number;
    isPrimary: boolean;
}