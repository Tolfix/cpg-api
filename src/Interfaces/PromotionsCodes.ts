import { IProduct } from "./Products";

export interface IPromotionsCodes
{
    id: number;
    name: string;
    discount: number;
    valid_to: Date | "permament";
    uses: number | "unlimited";
    procentage: boolean;
    products_ids: Array<IProduct["id"]>;
}