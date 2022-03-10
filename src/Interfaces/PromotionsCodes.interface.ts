import { IProduct } from "./Products.interface";

export interface IPromotionsCodes
{
    id: number;
    name: string;
    discount: number;
    valid_to: string | "permanent";
    uses: number | "unlimited";
    percentage: boolean;
    products_ids: Array<IProduct["id"]>;
}