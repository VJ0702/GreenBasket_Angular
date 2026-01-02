export interface CategorySearchRequest {
    id: number,
    name: string,
    slug: string
}


export interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    parentCategoryId: number;
    displayOrder: number;
    isActive: boolean;
    discountRate: number;
    productCount: number;
    iconClass: string | null;
    includeInTopMenu: boolean;
    includeInFooter: boolean;
    createdOnUtc: string;
    subCategories: Category[];
}


export interface CategoryResponse {
    categories: Category[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
