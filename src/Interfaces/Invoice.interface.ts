import { TPaymentCurrency } from "../Types/PaymentTypes";
import { IConfigurableOptions } from "./ConfigurableOptions.interface";
import { ICustomer } from "./Customer.interface";
import { TOrderStatus } from "./Orders.interface";
import { IPayments } from "./Payments.interface";
import { IProduct } from "./Products.interface";
import { ITransactions } from "./Transactions.interface";

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

/**
 * @typedef InvoiceItem
 * @property {string} notes
 * @property {number} amount
 * @property {boolean} taxed
 */

/**
 * @typedef InvoiceDates
 * @property {string} invoice_date
 * @property {string} due_date
 */

/**
 * @typedef Status
 * @property {string} active
 * @property {string} pending
 * @property {string} draft
 * @property {string} fraud
 * @property {string} cancelled
 * @property {string} refunded
 * @property {string} collections
 * @property {string} payment_pending
 */
export interface IInvoice
{
    id: any;
    uid: `INV_${string}`;
    customer_uid: ICustomer["uid"];
    dates: IInvoice_Dates;
    amount: number;
    items: Array<IInvoices_Items>;
    transactions: Array<ITransactions["uid"]>;
    payment_method: keyof IPayments;
    status: extendedOrderStatus;
    tax_rate: number;
    notes: string;
    paid: boolean;
    currency: TPaymentCurrency;
    notified: boolean;
}

export interface IInvoiceMethods
{
    getTotalAmount: <C extends boolean = false>({ 
        tax,
        currency,
        symbol
    }:
    {
        tax?: boolean;
        currency?: C;
        symbol?: boolean;
    }) => C extends false ? number : string;

}

export type extendedOrderStatus = TOrderStatus | "draft" | "refunded" | "collections" | "payment_pending";


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
    product_id?: IProduct["id"];
    configurable_options_id?: IConfigurableOptions["id"];
    configurable_options_index?: IConfigurableOptions["options"]["length"];
}