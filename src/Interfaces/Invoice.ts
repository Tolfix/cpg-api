import { Document } from "mongoose";
import { ICustomer } from "./Customer";
import { OrderStatus } from "./Orders";
import { IPayments } from "./Payments";
import { ITransactions } from "./Transactions";

/**
 * @typedef InvoiceCreate
 * @property {Array.<Transactions>} transactions
 * @property {number} amount
 * @property {Array.<InvoiceItem>} items
 * @property {string} payment_method
 * @property {InvoiceDates.model} dates
 * @property {Status} status
 * @property {number} tax_rate
 * @property {string} notes
 * @property {boolean} paid
 */
export function SwaggerDOC () {};

/**
 * @typedef InvoiceItem
 * @property {string} notes
 * @property {number} amount
 * @property {boolean} taxed
 */
export function SwaggerDOC1 () {};

/**
 * @typedef InvoiceDates
 * @property {string} invoice_date
 * @property {string} due_date
 */
export function SwaggerDOC2 () {};

/**
 * @typedef Status
 * @property {string} active
 * @property {string} pending
 * @property {string} draft
 * @property {string} fruad
 * @property {string} cancelled
 * @property {string} refunded
 * @property {string} collections
 * @property {string} payment_pending
 */
export function SwaggerDOC3 () {};
export interface IInvoice
{
    id: any;
    uid: `INV_${string}`;
    customer_uid: ICustomer["uid"];
    dates: IInvoice_Dates;
    amount: number;
    items: Array<IInvoices_Items>;
    transactions?: Array<ITransactions["uid"]>;
    payment_method: keyof IPayments;
    status: OrderStatus | "draft" | "refunded" | "collections" | "payment_pending";
    tax_rate: number;
    notes: string;
    paid: Boolean;
    notified: Boolean;
}

export interface IInvoice_Dates
{
    invoice_date: Date | string;
    due_date: Date | string;
}

export interface IInvoices_Items
{
    notes: string;
    amount: IInvoice["amount"];
    quantity: number;
}