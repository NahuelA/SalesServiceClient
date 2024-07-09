export interface BaseResponse<T> {
    message: string;
    isSuccess: boolean;
    isFound: boolean;
    data: T;
}
