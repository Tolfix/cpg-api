import { IInvoice } from "./Invoice.interface";
import { IPayments } from "./Payments.interface";
import { IPromotionsCodes } from "./PromotionsCodes.interface";

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
    notified: boolean;
    created_invoice: boolean;
    invoice_uid?: IInvoice["uid"] | IInvoice["id"];
}

export interface IQuoteItem
{
    name: string;
    tax_rate: number;
    price: number;
    quantity: number;
}