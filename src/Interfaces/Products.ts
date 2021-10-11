import { Document } from "mongoose";
import { ICategory } from "./Categories";

export interface IProduct
{
    uid: `PROD_${string}`;
    name: string;
    description: string;
    category_uid: ICategory["uid"];
    stock: number;
    BStock: Boolean;
    hidden: Boolean;
    special: boolean;
    payment_type: Partial<IPaymentType>;
    price: number;
    setup_fee: number;
    image?: IImageProduct;
    recurring_method?: Partial<IRecurringMethod>;
}

export interface IDProduct extends IProduct, Document {};

export interface IImageProduct
{
    data: Buffer;
    type: string;
    size: number;
    name: string;
}

export type IPaymentType = "free" | "one_time" | "recurring";

export type IRecurringMethod = "monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially";