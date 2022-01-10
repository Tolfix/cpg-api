import { Request, Response } from "express";
import { Company_Name, Full_Domain } from "../../../../Config";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import QuotesModel from "../../../../Database/Models/Quotes.model";
import { SendEmail } from "../../../../Email/Send";
import mainEvent from "../../../../Events/Main";
import { IQuotes } from "../../../../Interfaces/Quotes";
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
                    SendEmail(Customer.personal.email, `Quote from ${Company_Name === "" ? "CPG" : Company_Name}`, {
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
    const limit = parseInt(req.query._end as string)
    && parseInt(req.query._end as string) <= 100 ? 
                                                parseInt(req.query._end as string) 
                                                :
                                                25;
    let start = 0;
    if(req.query)
        if(req.query._start)
            start = Number.isInteger(parseInt(req.query._start as string)) ? parseInt(req.query._start as string) : 0;
    
    const sort = req.query._sort as string ?? "id";
    const order = req.query._order as string ?? "asc";
        
    API.findAll(limit, start, sort, order).then((result: any) =>
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