import { Request, Response } from "express";
import { Company_Name, Full_Domain } from "../../../../Config";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import QuotesModel from "../../../../Database/Models/Quotes.model";
import { SendEmail } from "../../../../Email/Send";
import mainEvent from "../../../../Events/Main.event";
import { IQuotes } from "../../../../Interfaces/Quotes.interface";
import getFullName from "../../../../Lib/Customers/getFullName";
import { idQuotes } from "../../../../Lib/Generator";
import { APISuccess } from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";

const API = new BaseModelAPI<IQuotes>(idQuotes, QuotesModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then(async (result) =>
        {
            
            if(req.body.send_email !== undefined && req.body.send_email)
            {
                // Get customer.
                const Customer = await CustomerModel.findOne({
                    $or: [
                        { id: result.customer_uid },
                        { uid: result.customer_uid as any }
                    ]
                });
                if(Customer)
                {
                    // Send email to customer.
                    SendEmail(Customer.personal.email, `Quote from ${await Company_Name() === "" ? "CPG" : await Company_Name()}`, {
                        isHTML: true,
                        body: `
                            <h1>Quote</h1>
                            <p>
                                Hello ${getFullName(Customer)}!
                            </p>
                            <p>
                                You have a new quote.
                            </p>
                            <p>
                                <a href="${Full_Domain}/v2/quotes/${result.uid}/view">
                                    Click here to view the quote.
                                </a>
                            </p>
                        `
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