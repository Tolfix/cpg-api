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
export interface ITransactions<E extends "income" | "expense" = any>
{
    id: number;
    uid: `TRAN_${string}`;
    customer_uid: E extends "income" ? ICustomer["uid"] : undefined;
    invoice_uid: E extends "income" ? IInvoice["uid"] : undefined;
    date: Date | string;
    payment_method: IInvoice["payment_method"];
    amount: IInvoice["amount"];
    currency: TPaymentCurrency;
    statement: E;
    /**
     * @description
     * If the transaction statement is expense, we will out information here
     * Since is not relative to our customers or invoices
     */
    expense_information: E extends "expense" ? {
        invoice_id: any;
        company: string;
        description: string;
        notes: string;        
        extra: {
            [key: string]: any;
        }
    } : undefined;
    fees: number;
}