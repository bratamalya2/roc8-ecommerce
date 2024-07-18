import type { Category } from "./Category";

export interface ApiResponse {
    isError: boolean;
    message?: string;
    categories?: Category[];
    selectedCategories?: Category[];
    accessToken?: string;
    refreshToken?: string;
}