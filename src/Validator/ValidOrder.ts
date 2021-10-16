import { Response } from "express";
import { CacheCustomer } from "../Cache/CacheCustomer";
import { CacheProduct } from "../Cache/CacheProduct";
import { IOrder } from "../Interfaces/Orders";
import { APIError } from "../Lib/Response";

export function validOrder(data: IOrder, res?: Response)
{
    if(typeof data.customer_uid !== "string")
    {
        if(res)
            APIError({
                text: `'customer_uid' has to be a string`,
            })(res);
        return false;
    }

    if(!CacheCustomer.get(data.customer_uid))
    {
        if(res)
            APIError({
                text: `'customer_uid' has no relation to a customer`,
            })(res);
        return false;
    }

    if(!data.billing_type.match(/free|one_time|recurring/g))
    {
        if(res)
            APIError({
                text: `'billing_type' has to be "free" | "one_time" | "recurring"`,
                valids: ["free", "one_time", "recurring"]
            })(res);
        return false;
    }

    if(data.billing_type === "recurring")
    {
        if(!data.billing_cycle?.match(/monthly|quarterly|semi_annually|biennially|triennially/g))
        {
            if(res)
                APIError({
                    text: `'billing_cycle' has to be "monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially"`,
                    valids: ["monthly", "quarterly", "semi_annually", "biennially", "triennially"]
                })(res);
            return false;
        }
        }

    if(typeof data.dates !== "object")
    {
        if(res)
            APIError({
                text: `'dates' has to be a object`,
            })(res);
        return false;        
    }

    if(!data.dates.createdAt)
    {
        if(res)
            APIError({
                text: `'dates.createdAt' has to be a date`,
            })(res);
        return false;        
    }

    if(!data.order_status.match(/active|pending|fruad|cancelled/g))
    {
        if(res)
            APIError({
                text: `'order_status' has to be "active" | "pending" | "fruad" | "cancelled"`,
                valids: ["active", "pending", "fruad", "cancelled"]
            })(res);
        return false;
    }

    /*
    none: null;
    manual: any;
    paypal: any;
    credit_card: any;
    swish: any;
    */
    if(!data.payment_method.match(/none|manual|paypal|credit_card|swish/g))
    {
        if(res)
            APIError({
                text: `'payment_method' has to be "none" | "manual" | "paypal" | "credit_card" | "swish"`,
                valids: ["none", "manual", "paypal", "credit_card", "swish"]
            })(res);
        return false;        
    }

    if(typeof data.product_uid !== "string")
    {
        if(res)
            APIError({
                text: `'product_uid' has to be a string`,
            })(res);
        return false;  
    }

    if(!CacheProduct.get(data.product_uid))
    {
        if(res)
            APIError({
                text: `'product_uid' has no relation to a product`,
            })(res);
        return false;  
    }

    if(typeof data.quantity !== "number")
    {
        if(res)
            APIError({
                text: `'quantity' has to be a number`,
            })(res);
        return false;
    }

    return true;
}