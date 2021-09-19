import { ICustomer } from "./Customer";
import { IPaymentType, IProduct, IRecurringMethod } from "./Products";

export interface IOrder
{
    customer_uid: ICustomer["uid"];
    payment_method: any;
    order_status: OrderStatus;

    product_uid: IProduct["uid"];
    billing_type: IPaymentType;
    billing_cycle?: IRecurringMethod;
    quantity: number;
    price_override: number;
}

export type OrderStatus = "active" | "pending" | "fruad" | "cancelled";