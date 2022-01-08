import { NextFunction, Request, Response } from "express";
import { Full_Domain, Paypal_Client_Id, Paypal_Client_Secret, Swish_Payee_Number } from "../../Config";
import { IInvoice } from "../../Interfaces/Invoice";
import { IOrder } from "../../Interfaces/Orders";
import { IPayments } from "../../Interfaces/Payments";
import { createSwishQRCode } from "../../Payments/Swish";
import { APISuccess } from "../Response";

export const ce_orders = new Map<keyof IPayments, (order: IOrder, 
    invoice: IInvoice, 
    req: Request, 
    res: Response, 
    next: NextFunction) => void>();

export async function run_swish_method(
    order: IOrder, 
    invoice: IInvoice, 
    req: Request, 
    res: Response, 
)
{
    if(Swish_Payee_Number !== "")
        return APISuccess(`data:image/png;base64,${await createSwishQRCode(Swish_Payee_Number, (invoice.amount)+(invoice.amount)*(invoice.tax_rate/100), `Invoice ${invoice.id}`)}`)(res);

    return APISuccess("Invoice sent")(res);
}
ce_orders.set("swish", run_swish_method);

export async function run_paypal_method(
    order: IOrder, 
    invoice: IInvoice, 
    req: Request, 
    res: Response, 
)
{
    if(Paypal_Client_Secret !== "" && Paypal_Client_Id !== "")
        return APISuccess(`${Full_Domain}/v2/paypal/pay/${invoice.uid}`)(res);

    return APISuccess("Invoice sent")(res);
}
ce_orders.set("paypal", run_paypal_method);

export async function run_credit_card_method(
    order: IOrder, 
    invoice: IInvoice, 
    req: Request, 
    res: Response, 
)
{
    return APISuccess(`${Full_Domain}/v2/stripe/pay/${invoice.uid}`)(res);
}
ce_orders.set("credit_card", run_credit_card_method);