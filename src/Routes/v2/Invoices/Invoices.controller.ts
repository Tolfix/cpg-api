import { Request, Response } from "express";
import InvoiceModel from "../../../Database/Models/Invoices";
import mainEvent from "../../../Events/Main";
import { IInvoice } from "../../../Interfaces/Invoice";
import { idInvoice } from "../../../Lib/Generator";
import { APIError, APISuccess } from "../../../Lib/Response";
import BaseModelAPI from "../../../Models/BaseModelAPI";

const API = new BaseModelAPI<IInvoice>(idInvoice, InvoiceModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then((result) => {

            mainEvent.emit("invoice_created", result);

            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as IInvoice["uid"])).then((result) => {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    let limit = parseInt(req.query._end as string)
    && parseInt(req.query._end as string) <= 100 ? 
                                                parseInt(req.query._end as string) 
                                                :
                                                25;
    let start = 0;
    if(req.query)
        if(req.query._start)
            start = Number.isInteger(parseInt(req.query._start as string)) ? parseInt(req.query._start as string) : 0;

    let sort = req.query._sort as string ?? "id";
    let order = req.query._order as string ?? "asc";

    API.findAll(limit, start, sort, order).then((result: any) => {
        APISuccess(result)(res)
    });
}

function patch(req: Request, res: Response)
{
    const paid = req.body.paid ?? false;
    API.findAndPatch((req.params.uid as IInvoice["uid"]), req.body).then((result) => {
        if(paid !== result.paid && result.paid)
            mainEvent.emit("invoice_paid", result);
        // @ts-ignore
        mainEvent.emit("invoice_updated", result);
        APISuccess(result)(res);
    }).catch((err) => {
        APIError(err)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as IInvoice["uid"])
        .then((result)=>{
            // @ts-ignore
            mainEvent.emit("invoice_deleted", result);            
            APISuccess(result, 204)(res)
        });
 };

const CustomerController = {
    insert,
    getByUid,
    list,
    patch,
    removeById
}

export default CustomerController;