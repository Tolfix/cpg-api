import { IProduct } from "./Products.interface";

export interface IConfigurableOptions
{
    uid: `CO_${string}`;
    id: any;
    name: string;
    products_ids: Array<IProduct["id"]>;
    options: Array<{
        name: string;
        price: number;
    }>;
}