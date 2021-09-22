import { Document } from "mongoose";
import { ICustomer } from "./Customer";
import { OrderStatus } from "./Orders";
import { IPayments } from "./Payments";

export interface IInvoice
{
    uid: string;
    customer_uid: ICustomer["uid"];
    invoiced_to: ICustomer["uid"];
    dates: IInvoice_Dates;
    amount: number;
    items: Array<IInvoices_Items>;
    transactions?: Array<IInvoices_Transactions>;
    payment_method: keyof IPayments;
    status: OrderStatus | "draft" | "refunded" | "collections" | "payment_pending";
    tax_rate: number;
    notes: string;
    paid: Boolean;
}

export interface IDInvoice extends IInvoice, Document {};

export interface IInvoice_Dates
{
    invoice_date: string;
    due_date: string;
}

export interface IInvoices_Items
{
    notes: string;
    amount: IInvoice["amount"];
    taxed: Boolean;
}

export interface IInvoices_Transactions
{
    uid: string;
    date: string;
    payment_method: IInvoice["payment_method"];
    amount: IInvoice["amount"];
    fees: number;
}