import { Request, Response } from "express";
import dateFormat from "date-and-time";
import CategoryModel from "../../../Database/Schemas/Category";
import InvoiceModel from "../../../Database/Schemas/Invoices";
import OrderModel from "../../../Database/Schemas/Orders";
import ProductModel from "../../../Database/Schemas/Products";
import { IInvoices_Items } from "../../../Interfaces/Invoice";
import { IOrder } from "../../../Interfaces/Orders";
import nextRycleDate from "../../../Lib/Dates/DateCycle";
import { idInvoice, idOrder } from "../../../Lib/Generator";
import { APISuccess } from "../../../Lib/Response";
import BaseModelAPI from "../../../Models/BaseModelAPI";

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

    // Get our product
    const Product = await ProductModel.findOne({ id: req.body.product_uid });

    // Get our category
    const Category = await CategoryModel.findOne({ id: Product?.category_uid });

    // Get customer id
    const Customer_Id = req.body.customer_uid;

    // Create invoice
    const newInvoice = await (new InvoiceModel({
        uid: idInvoice(),
        customer_uid: Customer_Id,
        dates: {
            due_date: dates.next_recycle,
            invoiced_date: dateFormat.format(new Date(), "YYYY-MM-DD"),
        },
        amount: Product?.price,
        items: [
            <IInvoices_Items>{
                amount: Product?.price,
                notes: `${Category?.name} - ${Product?.name}`,
                quantity: req.body.quantity
            }
        ],
        payment_method: req.body.payment_method,
        status: req.body.order_status,
        tax_rate: Product?.tax_rate,
        notes: "",
        paid: false,
        notified: false,
    })).save();

    req.body.invoices = [newInvoice.id];

    API.create(req.body)
        .then((result) => {
            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as IOrder["uid"])).then((result) => {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    let limit = parseInt(req.query.limit as string)
    && parseInt(req.query.limit as string) <= 100 ? 
                                                            parseInt(req.query.limit as string) 
                                                            :
                                                            10;
    let page = 0;
    if(req.query)
    {
        if(req.query.page)
        {
            let p = parseInt(req.query.page as string);
            page = Number.isInteger(p) ? p : 0;
        }
    }

    API.findAll(limit, page).then((result: any) => {
        APISuccess(result)(res)
    });
}

function patch(req: Request, res: Response)
{
    API.findAndPatch((req.params.uid as IOrder["uid"]), req.body).then((result) => {
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as IOrder["uid"])
        .then((result)=>{
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