import { IProduct } from "./Products";

export interface IConfigurableOptions
{
    uid: `CO_${string}`;
    id: number;
    products_ids: Array<IProduct["id"]>;
    options: Array<{
        name: string;
        value: string;
    }>;
}