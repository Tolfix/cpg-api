import { IPayments, ISubscription } from "@ts/interfaces";
import { NextFunction, Response, Request } from "express";
import { Full_Domain, Paypal_Client_Id, Paypal_Client_Secret } from "../../Config";
import { APISuccess } from "../Response";

export const ce_subscription = new Map<keyof IPayments, (
    subscription: ISubscription, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => void>();

export async function run_credit_card_method(
    subscription: ISubscription, 
    req: Request, 
    res: Response, 
)
{
    return APISuccess(`${Full_Domain}/v2/stripe/subscription/place/${subscription.uid}`)(res);
}
ce_subscription.set("credit_card", run_credit_card_method);

export async function run_paypal_method(
    subscription: ISubscription, 
    req: Request, 
    res: Response, 
)
{
    if(Paypal_Client_Secret !== "" && Paypal_Client_Id !== "")
        return APISuccess(`${Full_Domain}/v2/paypal/subscription/place/${subscription.uid}`)(res);

    return APISuccess("Invoice sent")(res);
}
ce_subscription.set("paypal", run_paypal_method);