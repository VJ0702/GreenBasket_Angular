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
    urlHandle: string;
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