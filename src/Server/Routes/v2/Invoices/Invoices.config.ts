import { Application, Router } from "express";
import InvoiceModel from "../../../../Database/Models/Invoices.model";
import createPDFInvoice from "../../../../Lib/Invoices/CreatePDFInvoice";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import InvoiceController from "./Invoices.controller";
import { APISuccess } from "../../../../Lib/Response";
import { setTypeValueOfObj } from "../../../../Lib/Sanitize";

export = InvoiceRouter;
class InvoiceRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/invoices`, this.router);

        this.router.get("/", [
            EnsureAdmin(),
            InvoiceController.list
        ]);

        this.router.get("/json", (req, res) =>
        {
            const obj = Object.assign({}, InvoiceModel.schema.obj);
            setTypeValueOfObj(obj);
            return APISuccess(obj)(res);
        });

        this.router.get("/:uid", [
            EnsureAdmin(),
            InvoiceController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin(),
            InvoiceController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin(),
            InvoiceController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin(),
            InvoiceController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin(),
            InvoiceController.removeById
        ]);

        this.router.get("/:uid/pdf", EnsureAdmin(), async (req, res) =>
        {
            
            const invoice = await InvoiceModel.findOne({ id: req.params.uid });

            if(!invoice)
                return res.status(404).send("Invoice not found");

            const result = await createPDFInvoice(invoice);

            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="invoice.pdf"`,
                'Content-Type': "application/pdf",
            });

            res.end(result, "base64");
        });

        this.router.get("/:uid/preview", EnsureAdmin(), async (req, res) =>
        {
            const invoice = await InvoiceModel.findOne({ id: req.params.uid });

            if(!invoice)
                return res.status(404).send("Invoice not found");

            const result = await createPDFInvoice(invoice);

            res.writeHead(200, {
                'Content-Type': "application/pdf",
            });

            res.end(result, "base64");
        });
    }

}