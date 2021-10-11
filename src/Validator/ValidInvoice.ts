import { Response } from "express";
import { IInvoice } from "../Interfaces/Invoice";
import { APIError } from "../Lib/Response";

export function isValidInvoice(invoice: IInvoice, res?: Response)
{
    if(typeof invoice.amount !== "number")
    {
        if(res)
            APIError({
                text: `'amount' has to be a number`,
            })(res);
        return false;
    }

    if(typeof invoice.tax_rate !== "number")
    {
        if(res)
            APIError({
                text: `'tax_rate' has to be a number`,
            })(res);
        return false;
    }

    if(typeof invoice.notes !== "string")
    {
        if(res)
            APIError({
                text: `'notes' has to be a string`,
            })(res);
        return false;
    }

    if(typeof invoice.paid !== "boolean")
    {
        if(res)
            APIError({
                text: `'paid' has to be a boolean`,
            })(res);
        return false;
    }

    if(typeof invoice.paid !== "boolean")
    {
        if(res)
            APIError({
                text: `'paid' has to be a boolean`,
            })(res);
        return false;
    }
    
    if(!invoice.status.match(/active|pending|fruad|cancelled|draft|refunded|collections|payment_pending/g))
    {
        if(res)
            APIError({
                text: `'status' didn't contain the following "active","pending","fruad","cancelled","draft","refunded","collections","payment_pending".`,
                valids: ["active","pending","fruad","cancelled","draft","refunded","collections","payment_pending"]
            })(res);
        return false;
    }

    return true;
}