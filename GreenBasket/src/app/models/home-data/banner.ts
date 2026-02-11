export interface Banner {
    id: number;
    title: string;
    subTitle: string | null;
    priceText: string | null;
    buttonText: string;
    buttonUrl: string | null;
    imageUrl: string;
    mobileImageUrl: string;
    imageAltText: string | null;
    textColor: string;
    backgroundColor: string | null;
    textAlignment: string;
    openInNewTab: boolean;
    displayOrder: number;
}

export interface HomeBannersData {
    sliderBanners: Banner[];
    midBanners: Banner[];
    sideBanners: Banner[];
    offerBanners: Banner[];
}