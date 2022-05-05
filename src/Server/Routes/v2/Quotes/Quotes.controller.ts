import { Request, Response } from "express";
import { Company_Name } from "../../../../Config";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import QuotesModel from "../../../../Database/Models/Quotes.model";
import { SendEmail } from "../../../../Email/Send";
import mainEvent from "../../../../Events/Main.event";
import { IQuotes } from "@interface/Quotes.interface";
import { idQuotes } from "../../../../Lib/Generator";
import { APISuccess } from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";
import QuoteCreateTemplate from "../../../../Email/Templates/Quotes/Quote.create.template";

const API = new BaseModelAPI<IQuotes>(idQuotes, QuotesModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then(async (result) =>
        {
            
            if (req.body.send_email !== undefined && req.body.send_email)
            {
                // Get customer.
                const Customer = await CustomerModel.findOne({
                    $or: [
                        { id: result.customer_uid },
                        { uid: result.customer_uid as any }
                    ]
                });
                if (Customer)
                {
                    // Send email to customer.
                    await SendEmail(Customer.personal.email, `Quote from ${await Company_Name() === "" ? "CPG" : await Company_Name()}`, {
                        isHTML: true,
                        body: await QuoteCreateTemplate(result, Customer)
                    });
                }
            }

            mainEvent.emit("quotes_created", result);

            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as IQuotes["uid"])).then((result) =>
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
    API.findAndPatch((req.params.uid as IQuotes["uid"]), req.body).then((result) =>
    {
        // @ts-ignore
        mainEvent.emit("quotes_updated", result);
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as IQuotes["uid"])
        .then((result)=>
        {
            // @ts-ignore
            mainEvent.emit("quotes_deleted", result);
            APISuccess(result, 204)(res)
        });
 }

const QuotesController = {
    insert,
    getByUid,
    list,
    patch,
    removeById
}

export default QuotesController;