export interface WorkingHour {
    day: string;
    hours: string;
    isClosed: boolean;
}
export interface ContactInfo {
    phone1: string;
    phone2?: string | null;
    email?: string | null;
    address?: string | null;
    whatsApp?: string | null;
}
export interface ContactUsPage {
    title: string;
    subtitle?: string | null;
    shortDescription?: string | null;
    content?: string | null;
    bannerImageUrl?: string | null;
    mapEmbedUrl?: string | null;
    mapLatitude?: number | null;
    mapLongitude?: number | null;
    workingHours?: WorkingHour[];
    contactInfo?: ContactInfo;
    metaTitle?: string | null;
    metaDescription?: string | null;
}

export interface ContactRequest {
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    subject?: string | null;
    inquiryType?: string | null;
    message: string;
    sourceUrl?: string | null;
    referrer?: string | null;
}

export interface ContactResponseData {
    id: number;
    message: string;
    referenceNumber?: string | null;
}