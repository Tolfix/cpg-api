import { Application, Router } from "express";
import { CacheInvoice } from "../Cache/CacheInvoices";
import { IInvoice } from "../Interfaces/Invoice";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

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

    }
}