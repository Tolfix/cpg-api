import { TPayments, TRecurringMethod } from "../Types/PaymentMethod";
import { IConfigurableOptions } from "./ConfigurableOptions.interface";
import { ICustomer } from "./Customer.interface";
import { extendedOrderStatus } from "./Invoice.interface";
import { IProduct } from "./Products.interface";
import { IPromotionsCodes } from "./PromotionsCodes.interface";
import { ITransactions } from "./Transactions.interface";

export interface ISubscription
{
    id: number;
    uid: `SUB_${string}`;
    customer_id: ICustomer["id"];
    products: Array<ISubscriptionProducts>;
    start_date: string;
    renewing_method: TRecurringMethod;
    promotion_codes: Array<IPromotionsCodes["id"]>;
    payment_method: Exclude<TPayments, "bank" | "manual" | "none" | "swish">;
    status: extendedOrderStatus;
    transactions: Array<ITransactions["uid"]>;
}

export interface ISubscriptionProducts
{
    product_id: IProduct["id"],
    configurable_options_ids?: Array<{
        id: IConfigurableOptions["id"],
        option_index: number;
    }>,
    quantity: number
}