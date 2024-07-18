import type { Category } from "./Category";

export interface InitResponse {
    isError: boolean;
    categories: Category[];
    message?: string;
}