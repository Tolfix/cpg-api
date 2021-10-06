import { Document } from "mongoose";
import { IInvoice } from "./Invoice";

export interface ITransactions
{
    uid: `TRAN_${string}`;
    date: string;
    payment_method: IInvoice["payment_method"];
    amount: IInvoice["amount"];
    fees: number;
}

export interface IDTransactions extends ITransactions, Document {};