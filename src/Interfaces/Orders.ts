import { Document } from "mongoose";
import { ICustomer } from "./Customer";
import { IInvoice } from "./Invoice";
import { IPayments } from "./Payments";
import { IPaymentType, IProduct, IRecurringMethod } from "./Products";

/**
 * @typedef Order
 * @property {string} uid
 * @property {string} customer_uid
 * @property {string} payment_method
 * @property {string} order_status "active" | "pending" | "fruad" | "cancelled"
 * @property {string} product_uid
 * @property {string} billing_type "free" | "one_time" | "recurring"
 * @property {string} billing_cycle "monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially"
 * @property {number} quantity
 * @property {number} price_override Overwrite price from product
 * @property {object} dates
 */
export function Swagger_DOC () {};

export interface IOrder
{
    uid: `ORD_${string}`;
    customer_uid: ICustomer["uid"];
    payment_method: keyof IPayments;
    order_status: OrderStatus;
    product_uid: IProduct["uid"];
    billing_type: IPaymentType;
    /**
     * @description
     * if 'billing_type' is "recurring" `billing_cycle` wont be undefined
     */
    billing_cycle?: IRecurringMethod;
    quantity: number;
    price_override?: number;
    dates: IOrderDates;
    invoices: Array<IInvoice["uid"]>;
}

export interface IDOrder extends IOrder, Document {};

export type OrderStatus = "active" | "pending" | "fruad" | "cancelled";

export interface IOrderDates
{
    createdAt: Date;
    
    /**
     * @description
     * if 'billing_type' is "recurring" `last_recycle` wont be undefined
     */    
    last_recycle?: Date;

    /**
     * @description
     * if 'billing_type' is "recurring" `next_recycle` wont be undefined
     */    
    next_recycle?: Date;
}