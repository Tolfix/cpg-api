import { TRecurringMethod } from "../Types/PaymentMethod";
import { TPaymentCurrency, TPaymentTypes } from "../Types/PaymentTypes";
import { IConfigurableOptions } from "./ConfigurableOptions.interface";
import { ICustomer } from "./Customer.interface";
import { IInvoice } from "./Invoice.interface";
import { IPayments } from "./Payments.interface";
import { IProduct } from "./Products.interface";
import { IPromotionsCodes } from "./PromotionsCodes.interface";

/**
 * @typedef Order
 * @property {string} uid
 * @property {string} customer_uid
 * @property {string} payment_method
 * @property {string} order_status "active" | "pending" | "fraud" | "cancelled"
 * @property {string} product_uid
 * @property {string} billing_type "free" | "one_time" | "recurring"
 * @property {string} billing_cycle "monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially"
 * @property {number} quantity
 * @property {number} price_override Overwrite price from product
 * @property {object} dates
 */

export interface IOrder
{
    id: any;
    uid: `ORD_${string}`;
    customer_uid: ICustomer["uid"];
    products: Array<{
        product_id: IProduct["id"],
        configurable_options?: Array<{
            id: IConfigurableOptions["id"],
            option_index: number;
        }>,
        quantity: number
    }>;
    payment_method: keyof IPayments;
    order_status: TOrderStatus;
    billing_type: TPaymentTypes;
    /**
     * @description
     * if 'billing_type' is "recurring" `billing_cycle` wont be undefined
     */
    billing_cycle?: TRecurringMethod;
    price_override?: number;
    dates: IOrderDates<IOrder["billing_type"]>;
    invoices: Array<IInvoice["uid"]>;
    currency: TPaymentCurrency;
    promotion_code?: IPromotionsCodes["id"];
}


export type TOrderStatus = "active" | "pending" | "fraud" | "cancelled";
export const A_OrderStatus = [
    "active",
    "pending",
    "fraud",
    "cancelled"
]

export interface IOrderDates<isRecurring extends string>
{
    createdAt: Date;
    
    /**
     * @description
     * if 'billing_type' is "recurring" `last_recycle` wont be undefined
     */    
    last_recycle: isRecurring extends "recurring" ? string : undefined;

    /**
     * @description
     * if 'billing_type' is "recurring" `next_recycle` wont be undefined
     */    
    next_recycle: isRecurring extends "recurring" ? string : undefined;
}