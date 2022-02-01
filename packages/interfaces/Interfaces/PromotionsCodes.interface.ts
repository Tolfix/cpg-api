import { IProduct } from "./Products.interface";

export interface IPromotionsCodes
{
    id: number;
    name: string;
    discount: number;
    valid_to: string | "permament";
    uses: number | "unlimited";
    procentage: boolean;
    products_ids: Array<IProduct["id"]>;
}