import { IConfigurableOptions } from "./ConfigurableOptions";
import { ICustomer } from "./Customer";
import { IInvoice } from "./Invoice";
import { IPayments } from "./Payments";
import { IPaymentType, IProduct, IRecurringMethod } from "./Products";
import { IPromotionsCodes } from "./PromotionsCodes";

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
    id: any;
    uid: `ORD_${string}`;
    customer_uid: ICustomer["uid"];
    products: Array<{
        product_id: IProduct["id"],
        configurable_options_ids?: Array<{
            id: IConfigurableOptions["id"],
            option_index: number;
        }>,
        quantity: number
    }>;
    payment_method: keyof IPayments;
    order_status: OrderStatus;
    billing_type: IPaymentType;
    /**
     * @description
     * if 'billing_type' is "recurring" `billing_cycle` wont be undefined
     */
    billing_cycle?: IRecurringMethod;
    price_override?: number;
    dates: IOrderDates<IOrder["billing_type"]>;
    invoices: Array<IInvoice["uid"]>;
    promotion_codes?: Array<IPromotionsCodes["id"]>;
}


export type OrderStatus = "active" | "pending" | "fraud" | "cancelled";

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