import { TPaymentCurrency } from "../Lib/Currencies";
import { ICustomer } from "./Customer.interface";
import { IInvoice } from "./Invoice.interface";

/**
 * @typedef Transactions
 * @property {string} uid
 * @property {Date} date 
 * @property {string} payment_method
 * @property {number} amount
 * @property {number} fees 
 */
export interface ITransactions
{
    id: number;
    uid: `TRAN_${string}`;
    customer_uid: ICustomer["uid"];
    invoice_uid: IInvoice["uid"];
    date: Date | string;
    payment_method: IInvoice["payment_method"];
    amount: IInvoice["amount"];
    currency: TPaymentCurrency;
    statement: "income" | "expense";
    fees: number;
}