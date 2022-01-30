import { Request, Response } from "express";
import dateFormat from "date-and-time";
import OrderModel from "../../../../Database/Models/Orders.model";
import { IOrder } from "../../../../Interfaces/Orders.interface";
import nextRycleDate from "../../../../Lib/Dates/DateCycle";
import { idOrder } from "../../../../Lib/Generator";
import { APISuccess } from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";
import { createInvoiceFromOrder } from "../../../../Lib/Orders/newInvoice";
import { SendEmail } from "../../../../Email/Send";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import NewOrderCreated from "../../../../Email/Templates/Orders/NewOrderCreated";
import { Company_Name } from "../../../../Config";
import mainEvent from "../../../../Events/Main.event";

const API = new BaseModelAPI<IOrder>(idOrder, OrderModel);

async function insert(req: Request, res: Response)
{
    // Configure dates
    const billing_type = req.body.billing_type as IOrder["billing_type"];
    const b_recurring = billing_type === "recurring";
    const billing_cycle = req.body.billing_cycle as IOrder["billing_cycle"] ?? "monthly";

    const dates = {
        createdAt: new Date(),
        last_recycle: b_recurring ? dateFormat.format(new Date(), "YYYY-MM-DD") : undefined,
        next_recycle: b_recurring ? dateFormat.format(nextRycleDate(new Date(), billing_cycle), "YYYY-MM-DD") : undefined,
    }

    req.body.dates = dates;

    const newInvoice = await createInvoiceFromOrder(req.body as IOrder);

    req.body.invoices = [newInvoice.id];

    API.create(req.body)
        .then(async (result) =>
        {

            mainEvent.emit("order_created", result);

            const customer = await CustomerModel.findOne({ id: result.customer_uid });

            if(customer)
                SendEmail(customer.personal.email, `New order from ${await Company_Name() !== "" ? await Company_Name() : "CPG"} #${result.id}`, {
                    isHTML: true,
                    body: NewOrderCreated(result, customer), 
                });

            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as IOrder["uid"])).then((result) =>
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
    API.findAndPatch((req.params.uid as IOrder["uid"]), req.body).then((result) =>
    {
        // @ts-ignore
        mainEvent.emit("order_updated", result);
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as IOrder["uid"])
        .then((result)=>
        {
            // @ts-ignore
            mainEvent.emit("order_deleted", result);
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