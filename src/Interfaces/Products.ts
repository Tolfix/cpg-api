import { Document } from "mongoose";
import { ICategory } from "./Categories";

export interface IProduct
{
    uid: string;
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
    recurring_method: Partial<IRecurringMethod>;
}

export interface IDProduct extends IProduct, Document {};

export type IPaymentType = "free" | "one_time" | "recurring";

export type IRecurringMethod = "monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially";