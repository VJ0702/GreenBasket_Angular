// Blog model interfaces

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
