export interface BaseResponse<T> {
    message?: string;
    isSuccess?: boolean;
    isFound?: boolean;
    info?: boolean;
    errors?: Errors[];
    identityErrors?: any;
    data: T;
}

export interface Errors {
    propertyName: string;
    errorMessage: string;
}
