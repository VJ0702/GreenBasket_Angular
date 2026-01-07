export interface RegisterRequest {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    roleName?: string; // Optional, defaults to "Customer"
}

export interface RegisterResponse {
    userId: string;
    username: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    roles: string;
    createdAt: string;
    message: string;
}