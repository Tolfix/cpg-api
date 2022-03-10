import { Application, Router } from "express";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import QuotesModel from "../../../../Database/Models/Quotes.model";
import AW from "../../../../Lib/AW";
import createQuotePdf from "../../../../Lib/Quotes/CreateQuotePdf";
import QuoteToInvoice from "../../../../Lib/Quotes/QuoteToInvoice";
import { APIError, APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import EnsureAuth from "../../../../Middlewares/EnsureAuth";
import QuotesController from "./Quotes.controller";
import { sendInvoiceEmail } from "../../../../Lib/Invoices/SendEmail";

export = class QuotesRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/quotes`, this.router);

        this.router.get("/", [
            EnsureAdmin(),
            QuotesController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin(),
            QuotesController.getByUid
        ]);

        this.router.get("/:uid/view", EnsureAuth(), async (req, res) =>
        {
            const uid = req.params.uid;
            const [quote, e_quote] = await AW(await QuotesModel.findOne({ $or: [
                { uid: uid },
                { id: uid }
            ] }));

            if(e_quote || !quote)
                return APIError(`Failed to fetch quote with uid ${uid}`)(res);

            const [customer, e_customer] = await AW(CustomerModel.findOne({ $or: [
                { id: quote.customer_uid },
                { uid: quote.customer_uid as any }
            ] }));

            if(e_customer || !customer)
                return APIError(`Failed to fetch customer with uid ${quote.customer_uid}`)(res);

            const result = await createQuotePdf(quote);

            res.writeHead(200, {
                'Content-Type': "application/pdf",
            });

            res.end(result, "base64");
        });

        this.router.post("/:uid/accept", EnsureAuth(), async (req, res) =>
        {
            const uid = req.params.uid;
            const [quote, e_quote] = await AW(await QuotesModel.findOne({ $or: [
                { uid: uid },
                { id: uid }
            ] }));

            if(e_quote || !quote)
                return APIError(`Failed to fetch quote with uid ${uid}`)(res);

            const customer = await CustomerModel.findOne({ $or: [
                { id: quote.customer_uid },
                { uid: quote.customer_uid as any }
            ] });

            if(!customer)
                return APIError(`Failed to fetch customer with uid ${quote.customer_uid}`)(res);

            if(quote.accepted)
                return APIError(`Quote already accepted`)(res);

            quote.accepted = true;

            await quote.save();

            // Convert quote to invoice
            const invoice = await QuoteToInvoice(quote);
            if(!invoice)
                return APIError("Failed to convert quote to invoice")(res);

            // Send email to customer, no need to await since if it fails it will run cron either way
            sendInvoiceEmail(invoice, customer);

            return APISuccess(invoice)(res);
        });

        this.router.post("/:uid/decline", EnsureAuth(), async (req, res) =>
        {
            const uid = req.params.uid;
            const [quote, e_quote] = await AW(await QuotesModel.findOne({ $or: [
                { uid: uid },
                { id: uid }
            ] }));

            if(e_quote || !quote)
                return APIError(`Failed to fetch quote with uid ${uid}`)(res);

            quote.declined = true;

            await quote.save();

            return APISuccess(`Declined quote offer.`)(res);
        });

        this.router.post("/", [
            EnsureAdmin(),
            QuotesController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin(),
            QuotesController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin(),
            QuotesController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin(),
            QuotesController.removeById
        ]);
    }

}