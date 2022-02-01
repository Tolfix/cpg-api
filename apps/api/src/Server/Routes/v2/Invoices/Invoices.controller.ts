import { IInvoice } from "@ts/interfaces";
import { Request, Response } from "express";
import InvoiceModel from "../../../../Database/Models/Invoices.model";
import mainEvent from "../../../../Events/Main.event";
import { idInvoice } from "../../../../Lib/Generator";
import { APIError, APISuccess } from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";

const API = new BaseModelAPI<IInvoice>(idInvoice, InvoiceModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then((result) =>
        {

            mainEvent.emit("invoice_created", result);

            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as IInvoice["uid"])).then((result) =>
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
    const paid = req.body.paid ?? false;
    API.findAndPatch((req.params.uid as IInvoice["uid"]), req.body).then((result) =>
    {
        if(paid !== result.paid && result.paid)
            mainEvent.emit("invoice_paid", result);
        // @ts-ignore
        mainEvent.emit("invoice_updated", result);
        APISuccess(result)(res);
    }).catch((err) =>
    {
        APIError(err)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as IInvoice["uid"])
        .then((result)=>
        {
            // @ts-ignore
            mainEvent.emit("invoice_deleted", result);            
            APISuccess(result, 204)(res)
        });
 }

const CustomerController = {
    insert,
    getByUid,
    list,
    patch,
    removeById
}

export default CustomerController;