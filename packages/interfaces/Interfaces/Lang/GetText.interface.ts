import { Request } from "express";
import { ICustomer } from "../Customer.interface";
import { IInvoice } from "../Invoice.interface";
import { IOrder } from "../Orders.interface";
import { ITransactions } from "../Transactions.interface";

export interface IGetText
{
    txt_Uid_Description: string;
    txt_ApiError_default: (req: Request) => string;
    txt_Api_Listing: string;

    cron: IGetText_Cron;

    database: IGetText_Database;

    graphql: IGetText_Graphql;

    plugins: IGetText_Plugins;

    paypal: IGetText_Paypal;

    invoice: IGetText_Invoice;
}

export interface IGetText_Cron
{
    txt_Invoice_Checking: string;
    txt_Invoice_Found_Notify: (amount: number) => string;
    txt_Invoice_Found_Sending_Email: (customer: ICustomer) => string;

    txt_Orders_Checking: string;
    txt_Order_Checking: (order: IOrder) => string;
}

export interface IGetText_Database
{
    txt_Database_Error_default: string;
    txt_Database_Error_Lost_Connection: string;
    txt_Database_Opened: string;

    txt_Model_Created: (model: string, id: any) => string;
}

export interface IGetText_Graphql
{
    txt_Schemas_Loading: string;
    txt_Schemas_Adding: (schema: string) => string;

    txt_Resolver_Checking_Admin: (resolver: string) => string;
    txt_Resolver_Checking_User: (resolver: string) => string;
    txt_Apollo_Starting: string;
}

export interface IGetText_Plugins
{
    txt_Plugin_Loading: string;
    txt_Plugin_Installed: (plugin: string) => string;
    txt_Plugin_Loaded: (plugin: string) => string;
}

export interface IGetText_Paypal
{
    txt_Paypal_Creating_Payment_For_Invoice: (invoice: IInvoice) => string;
    txt_Paypal_Created_Transaction_From_Invoice: (transaction: ITransactions, invoice: IInvoice) => string;
}

export interface IGetText_Invoice
{
    txt_Invoice: string;
    txt_Number: string;
    txt_Date: string;
    txt_DueDate: string;
    txt_SubTotal: string;
    txt_Products: string;
    txt_Total: string;
    txt_Quantity: string;
    txt_Price: string;
    txt_ProductTotal: string;
}