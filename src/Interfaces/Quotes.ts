import { IInvoice } from "./Invoice";
import { IPromotionsCodes } from "./PromotionsCodes";

export interface IQuotes
{
    id: number;
    customer_uid: string;
    items: IQuoteItem[];
    promotion_codes: IPromotionsCodes[];
    due_date: string;
    memo: string;

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