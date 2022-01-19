import { TPayments, TRecurringMethod } from "../Types/PaymentMethod";
import { ICustomer } from "./Customer.interface";
import { extendedOrderStatus } from "./Invoice.interface";
import { IProduct } from "./Products.interface";
import { IPromotionsCodes } from "./PromotionsCodes.interface";

export interface ISubscription
{
    id: number;
    uid: `SUB_${string}`;
    customer_id: ICustomer["id"];
    items: Array<ISubscriptionItems>;
    start_date: string;
    renewing_method: TRecurringMethod;
    promotion_codes: Array<IPromotionsCodes["id"]>;
    payment_method: Exclude<TPayments, "bank" | "manual" | "none" | "swish">;
    status: extendedOrderStatus;
}

export interface ISubscriptionItems
{
    name: string,
    tax_rate: number,
    price: number,
    quantity: number,
}