import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import InvoiceController from "./Invoices.controller";
import easyinvoice from 'easyinvoice';
import InvoiceModel from "../../../Database/Schemas/Invoices";
import CustomerModel from "../../../Database/Schemas/Customer";


export default class InvoiceRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/invoices`, this.router);

        this.router.get("/", [
            InvoiceController.list
        ]);

        this.router.get("/:uid", [
            InvoiceController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            InvoiceController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            InvoiceController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            InvoiceController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            InvoiceController.removeById
        ]);

        this.router.get("/:uid/pdf", EnsureAdmin, async (req, res) => {
            const invoice = await InvoiceModel.findOne({ id: req.params.uid });
            if(!invoice)
                return res.send({});

            const Customer = await CustomerModel.findOne({ id: invoice.customer_uid });

            if(!Customer)
                return res.send({});

            let data = {
                "currency": "SEK",
                "taxNotation": "vat", //or gst
                "marginTop": 25,
                "marginRight": 25,
                "marginLeft": 25,
                "marginBottom": 25,
                "logo": "https://cdn.tolfix.com/images/TX-Small.png", //or base64
                "sender": {
                    "company": "Tolfix",
                    "address": "Kalendervägen 23",
                    "zip": "415 34",
                    "city": "Göteborg",
                    "country": "Sweden"
                },
                "client": {
                    "company": Customer.billing.company ?? `${Customer.personal.first_name} ${Customer.personal.last_name}`,
                    "address": Customer.billing.street01,
                    "zip": Customer.billing.postcode,
                    "city": Customer.billing.city,
                    "country": Customer.billing.country
                },
                "invoiceNumber": invoice.id,
                "invoiceDate": invoice.dates.due_date,
                "products": invoice.items.map((item) => {
                    return {
                        "quantity": item.quantity,
                        "description": item.notes,
                        "tax": invoice.tax_rate,
                        "price": item.amount
                    }
                }),
                "bottomNotice": "Kindly pay your invoice within 14 days.",
            };
            
            //@ts-ignore
            easyinvoice.createInvoice(data, (result: { pdf: any; }) => {
                res.writeHead(200, {
                    'Content-Disposition': `attachment; filename="invoice.pdf"`,
                    'Content-Type': "application/pdf",
                })
                res.end(result.pdf, "base64");
            });
        });
    }

}