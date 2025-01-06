export interface JsonResponse<T> {
    total: boolean;
    loaded: any;
    code: number;
    result: T;
    message: string;
}