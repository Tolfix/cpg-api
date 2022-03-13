import { Request, Response } from "express";
import ProductModel from "../../../../Database/Models/Products.model";
import mainEvent from "../../../../Events/Main.event";
import { IProduct } from "@interface/Products.interface";
import { idProduct } from "../../../../Lib/Generator";
import { APISuccess } from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";
import { currencyCodes, TPaymentCurrency } from "../../../../Lib/Currencies";
import { Company_Currency } from "../../../../Config";

const API = new BaseModelAPI<IProduct>(idProduct, ProductModel);

async function insert(req: Request, res: Response)
{

    if(!req.body.currency)
        req.body.currency = (await Company_Currency()).toUpperCase();

    // Check if our currency is valid
    // req.body.currency = igh7183
    const validCurrency = (currency: string) =>
    {
        currency = currency.toUpperCase();
        return currencyCodes.includes(currency as TPaymentCurrency);
    }

    if(!validCurrency(req.body.currency))
        req.body.currency = (await Company_Currency()).toUpperCase();
    
    API.create(req.body)
        .then((result) =>
        {

            mainEvent.emit("product_created", result);

            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as IProduct["uid"])).then((result) =>
    {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    API.findAll(req.query, res).then((result: any) =>
    {
        APISuccess(result)(res)
    });
}

function patch(req: Request, res: Response)
{
    API.findAndPatch((req.params.uid as IProduct["uid"]), req.body).then((result) =>
    {
        // @ts-ignore
        mainEvent.emit("product_updated", result);
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as IProduct["uid"])
        .then((result)=>
        {
            // @ts-ignore
            mainEvent.emit("product_deleted", result);
            APISuccess(result, 204)(res)
        });
 }

const ProductController = {
    insert,
    getByUid,
    list,
    patch,
    removeById
}

export default ProductController;