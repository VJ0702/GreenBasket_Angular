export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    errorCode: string;
    description: string;
    data: T;
}
