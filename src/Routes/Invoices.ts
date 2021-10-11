import { Application, Router } from "express";
import { CacheCustomer } from "../Cache/CacheCustomer";
import { CacheInvoice } from "../Cache/CacheInvoices";
import InvoiceModel from "../Database/Schemas/Invoices";
import { ICustomer } from "../Interfaces/Customer";
import { IInvoice } from "../Interfaces/Invoice";
import { idInvoice } from "../Lib/Generator";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";
import { isValidInvoice } from "../Validator/ValidInvoice";

export default class InvoiceRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/invoices", this.router);


        /**
         * Gets all invoices
         * @route GET /invoices
         * @group Invoices
         * @returns {Array} 200 - An array of invoices
         * @security JWT
         * @security Basic
         */
        this.router.get("/", EnsureAdmin, (req, res) => {
            APISuccess({
                invoices: CacheInvoice.array(),
            })(res);
        });

        /**
         * Gets specific invoices
         * @route GET /invoices/{uid}
         * @group Invoices
         * @param {string} uid.path.required - The uid of invoice.
         * @returns {Array} 200 - The invoice
         * @returns {Error} 400 - Unable to find by uid
         * @security JWT
         * @security Basic
         */    
        this.router.get("/:uid", EnsureAdmin, (req, res) => {
            const uid = req.params.uid as IInvoice["uid"];

            const invoice = CacheInvoice.get(uid);

            if(!invoice)
                return APIError({
                    text: `Unable to find invoice by uid ${uid}`,
                })(res);

            return APISuccess({
                invoice: invoice,
            })(res);
        });

        /**
         * Creates a invoice
         * @route POST /invoices/create
         * @group Invoices
         * @param {string} customer_uid.query.required - uid for customer.
         * @param {InvoiceCreate.model} data.body.required - Body for invoice.
         * @returns {Object} 200 - Created a new product.
         * @returns {Error} default - Missing something
         * @security JWT
         * @security Basic
         */
        this.router.post("/create", EnsureAdmin, (req, res) => {

            const customer_uid = req.query.customer_uid as ICustomer["uid"];

            if(!customer_uid)
                return APIError({
                    text: "No 'customer_uid' in query'"
                })(res);

            if(!CacheCustomer.get(customer_uid))
                return APIError({
                    text: `Unable to find customer by ${customer_uid}`,
                })(res);

            let {
                amount,
                items,
                transactions,
                payment_method,
                dates,
                status,
                tax_rate,
                notes,
                paid,
            } = req.body as any;

            let info: IInvoice = {
                uid: idInvoice(),
                customer_uid: customer_uid,
                invoiced_to: customer_uid,
                dates,
                status,
                tax_rate,
                notes,
                paid,
                amount,
                payment_method,
                items,
                transactions
            }

            if(!isValidInvoice(info, res))
                return;

            new InvoiceModel(info).save();
            CacheInvoice.set(info.uid, info);

            return APISuccess({
                text: `Succesfully created invoice`,
                uid: info.uid,
                invoice: info,
            })(res);
        });

    }
}