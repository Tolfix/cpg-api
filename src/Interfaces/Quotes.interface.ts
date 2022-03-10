import { TPaymentCurrency } from "../Lib/Currencies";
import { ICustomer } from "./Customer.interface";
import { IInvoice } from "./Invoice.interface";
import { IPayments } from "./Payments.interface";
import { IPromotionsCodes } from "./PromotionsCodes.interface";

export interface IQuotes
{
    uid: `QUO_${string}`;
    id: number;
    customer_uid: ICustomer["uid"];
    items: IQuoteItem[];
    promotion_codes: IPromotionsCodes["id"][] | [];
    due_date: string;
    memo: string;
    payment_method: keyof IPayments;
    notified: boolean;
    created_invoice: boolean;
    tax_rate: number;
    currency: TPaymentCurrency;
    accepted: boolean;
    declined: boolean;
    invoice_uid?: IInvoice["uid"] | IInvoice["id"];
}

export interface IQuoteItem
{
    name: string;
    price: number;
    quantity: number;
}