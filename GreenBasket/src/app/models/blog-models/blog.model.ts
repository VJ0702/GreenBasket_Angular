// Blog model interfaces

// Basic Blog (for list/recent views)
export interface Blog {
    id: number;
    title: string;
    urlSlug: string;
    shortDescription: string | null;
    featuredImageUrl: string;
    authorName: string;
    categoryName: string;
    categorySlug: string | null;
    viewCount: number;
    publishDate: string;
    createdOn: string;
    isFeatured: boolean;
}

// Blog Detail (full content for detail page)
export interface BlogDetail {
    id: number;
    title: string;
    urlSlug: string;
    shortDescription: string | null;
    body: string;
    featuredImageUrl: string;
    featuredImageAlt: string;
    authorName: string;
    categoryName: string;
    categorySlug: string;
    categoryId: number;
    tags: string;
    tagList: string[];
    viewCount: number;
    allowComments: boolean;
    publishDate: string;
    createdOn: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    images: BlogImage[];
    comments: BlogComment[];
    commentCount: number;
}

// Blog Image
export interface BlogImage {
    id: number;
    imageUrl: string;
    altText: string;
    title: string | null;
    displayOrder: number;
}

// Blog Comment
export interface BlogComment {
    id: number;
    customerName: string;
    commentText: string;
    createdOn: string;
    replies?: BlogComment[];
    blogPostId: number;
    customerEmail?: string;
    parentCommentId: number | null;
    avatarUrl?: string;
}

// Blog Category with count (matches API response)
export interface BlogCategory {
    id: number;
    name: string;
    urlSlug: string;
    imageUrl: string;
    postCount: number;
}

// Paginated Blogs Response (matches API response)
export interface PaginatedBlogs {
    posts: Blog[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Blog List Request Params
export interface BlogListParams {
    search?: string;
    categoryId?: number;
    pageNumber?: number;
    pageSize?: number;
}

// Create Comment Request (matches API)
export interface CreateCommentRequest {
    blogPostId: number;
    parentCommentId: number | null;
    customerName: string;
    customerEmail: string;
    commentText: string;
    userId: string | null;
}
