import { Document } from "mongoose";
import { IInvoice } from "./Invoice";

/**
 * @typedef Transactions
 * @property {string} uid
 * @property {Date} date 
 * @property {string} payment_method
 * @property {number} amount
 * @property {number} fees 
 */
export function SwaggerDOC () {};
export interface ITransactions
{
    uid: `TRAN_${string}`;
    date: Date | string;
    payment_method: IInvoice["payment_method"];
    amount: IInvoice["amount"];
    fees: number;
}

export interface IDTransactions extends ITransactions, Document {};