
export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
    maskedEmail: string;
    tokenExpirationMinutes: number;
    requestedAt: string;
}

export interface ValidateResetTokenRequest {
    email: string;
    token: string;
}

export interface ResetPasswordRequest {
    email: string;
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
    userId: string;
    email: string;
    resetAt: string;
    loginUrl: string;
}