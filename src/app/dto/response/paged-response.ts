export interface PagedResponse<T> {
    content: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    last: boolean;
}