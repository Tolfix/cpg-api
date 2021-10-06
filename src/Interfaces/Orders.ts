import { Document } from "mongoose";
import { ICustomer } from "./Customer";
import { IInvoice } from "./Invoice";
import { IPayments } from "./Payments";
import { IPaymentType, IProduct, IRecurringMethod } from "./Products";

export interface IOrder
{
    uid: `ORD_${string}`;
    invoice_uid?: IInvoice["uid"];
    customer_uid: ICustomer["uid"];
    payment_method: keyof IPayments;
    order_status: OrderStatus;
    product_uid: IProduct["uid"];
    billing_type: IPaymentType;
    /**
     * @description
     * if 'billing_type' is recurring billing_cycle wont be optional
     */
    billing_cycle?: IRecurringMethod;
    quantity: number;
    price_override: number;
}

export interface IDOrder extends IOrder, Document {};

export type OrderStatus = "active" | "pending" | "fruad" | "cancelled";