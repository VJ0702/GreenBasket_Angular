export interface LoginRequest {
    username: string;
    password: string;
    rememberme?: boolean;
}
export interface LoginResponse {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    profilePictureUrl?: string;
}

export interface UserProfile {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string;
    phoneNumber?: string;
    isEmailVerified?: boolean;
    profilePictureUrl?: string;
    createdAt: string;
    modifiedAt: string;
    addresses?: Address[];
}

export interface Address {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    companyName?: string;
    countryId: string;
    stateProvinceId: string;
    county?: string;
    city: string;
    address1: string;
    address2?: string;
    zipPostalCode: string;
    isBillingAddress: boolean;
    isShippingAddress: boolean;
}

// Add update profile request
export interface UpdateProfileRequest {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

// Add change password request
export interface ChangePasswordRequest {
    userId: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Add address request
export interface AddressRequest {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    companyName?: string;
    countryId: string;
    stateProvinceId: string;
    county?: string;
    city: string;
    address1: string;
    address2?: string;
    zipPostalCode: string;
    isBillingAddress: boolean;
    isShippingAddress: boolean;
}