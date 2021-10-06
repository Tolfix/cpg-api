import { Response } from "express";
import { IProduct } from "../Interfaces/Products";
import { APIError } from "../Lib/Response";

export function isValidProduct(product: IProduct, res?: Response)
{
    if(typeof product.payment_type !== "string")
    {
        if(res)
            APIError({
                text: `'payment_type' has to be a string`,
            })(res);
        return false;
    }

    if(!product.payment_type.match(/free|one_time|recurring/g))
    {
        if(res)
            APIError({
                text: `'payment_type' didn't contain the following 'free', 'one_time', 'recurring'.`,
                valids: ['free', 'one_time', 'recurring']
            })(res);
        return false;
    }

    if(typeof product.price !== "number")
    {
        if(res)
            APIError({
                text: `'price' has to be a number`,
            })(res);
        return false;
    }

    if(typeof product.setup_fee !== "number")
    {
        if(res)
            APIError({
                text: `'setup_fee' has to be a number`,
            })(res);
        return false;
    }

    if(typeof product.special !== "boolean")
    {
        if(res)
            APIError({
                text: `'special' has to be a boolean`,
            })(res);
        return false;
    }

    if(typeof product.stock !== "number")
    {
        if(res)
            APIError({
                text: `'stock' has to be a number`,
            })(res);
        return false;
    }

    if(typeof product.BStock !== "boolean")
    {
        if(res)
            APIError({
                text: `'BStock' has to be a boolean`,
            })(res);
        return false;
    }

    if(!typeof product?.recurring_method?.match(/monthly|quarterly|semi_annually|biennially|triennially/g))
    {
        if(res)
            APIError({
                text: `'recurring_method' has to be 'monthly', 'quarterly', 'semi_annually', 'biennially', 'triennially'.`,
                valids: ['monthly', 'quarterly', 'semi_annually', 'biennially', 'triennially']
            })(res);
        return false;
    }

    return true;
}