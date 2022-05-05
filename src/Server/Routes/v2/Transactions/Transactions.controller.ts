import { Request, Response } from "express";
import InvoiceModel from "../../../../Database/Models/Invoices.model";
import TransactionsModel from "../../../../Database/Models/Transactions.model";
import mainEvent from "../../../../Events/Main.event";
import { ITransactions } from "@interface/Transactions.interface";
import { idTransactions } from "../../../../Lib/Generator";
import { APISuccess } from "../../../../Lib/Response";
import sendEmailOnTransactionCreation from "../../../../Lib/Transaction/SendEmailOnCreation";
import BaseModelAPI from "../../../../Models/BaseModelAPI";
import { getDate } from "../../../../Lib/Time";

const API = new BaseModelAPI<ITransactions>(idTransactions, TransactionsModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then(async (result) =>
        {
            // check if we got a invoice id
            if (req.body.invoice_uid)
            {
                // Get invoice
                const invoice = await InvoiceModel.findOne({
                    $or: [
                        {
                            "uid": req.body.invoice_uid
                        },
                        {
                            "id": req.body.invoice_uid
                        }
                    ]
                });

                if (invoice)
                {
                    // Update invoice
                    invoice.transactions.push(result.uid);
                    invoice.markModified("transactions");
                    // Check if they wanted to mark it as paid as well
                    if (req.body.markInvoiceAsPaid)
                    {
                        invoice.status = "collections";
                        invoice.markModified("status");
                        invoice.paid = true;
                        invoice.markModified("paid");
                        invoice.dates.date_paid = getDate();
                        invoice.markModified("dates");
                    }
                    await invoice.save();
                }
            }

            mainEvent.emit("transaction_created", result);
            await sendEmailOnTransactionCreation(result);

            return APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as ITransactions["uid"])).then((result) =>
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
    API.findAndPatch((req.params.uid as ITransactions["uid"]), req.body).then((result) =>
    {
        // @ts-ignore
        mainEvent.emit("transaction_updated", result);
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as ITransactions["uid"])
        .then((result) =>
        {
            // @ts-ignore
            mainEvent.emit("transaction_deleted", result);
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