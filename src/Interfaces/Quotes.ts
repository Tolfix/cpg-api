import { IInvoice } from "./Invoice";
import { IPayments } from "./Payments";
import { IPromotionsCodes } from "./PromotionsCodes";

export interface IQuotes
{
    uid: `QUO_${string}`;
    id: number;
    customer_uid: string;
    items: IQuoteItem[];
    promotion_codes: IPromotionsCodes["id"][] | [];
    due_date: string;
    memo: string;
    payment_method: keyof IPayments;
    notifed: boolean;
    created_invoice: boolean;
    invoice_uid?: IInvoice["uid"] | IInvoice["id"];
}

export interface IQuoteItem
{
    name: string;
    price: number;
    quantity: number;
}