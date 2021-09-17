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
    special: number;
    payment_type: Partial<keyof IPaymentType>;
    price: number;
    setup_fee: number;
    recurring_method: Partial<keyof IRecurringMethod>;
}

export interface IDProduct extends IProduct, Document {};

export interface IPaymentType
{
    free: Boolean;
    one_time: Boolean;
    recurring: Boolean;
}

export interface IRecurringMethod
{
    monthly: Boolean;
    quarterly: Boolean;
    semi_annually: Boolean;
    biennially: Boolean;
    triennially: Boolean;
}