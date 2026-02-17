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
    blogId: number;
    userName: string;
    userEmail?: string;
    avatarUrl?: string;
    message: string;
    createdOn: string;
    parentId: number | null;
    replies?: BlogComment[];
}

// Blog Category with count (matches API response)
export interface BlogCategory {
    id: number;
    name: string;
    urlSlug: string;
    imageUrl: string;
    postCount: number;
}

// Paginated Blogs Response
export interface PaginatedBlogs {
    blogs: Blog[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// Create Comment Request
export interface CreateCommentRequest {
    blogId: number;
    userName: string;
    userEmail: string;
    message: string;
    parentId?: number | null;
}
