import { Application, Router } from "express";
import { Company_Website } from "../../../../Config";
import InvoiceModel from "../../../../Database/Models/Invoices.model";
import { IInvoice } from "../../../../Interfaces/Invoice.interface";
import { createPaypalPaymentFromInvoice, retrievePaypalTransaction } from "../../../../Payments/Paypal";

export = class PaypalRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/paypal`, this.router);

        this.router.get("/pay/:invoiceUid", async (req, res) =>
        {
            const invoiceUid = req.params.invoiceUid;
            const invoice = await InvoiceModel.findOne({ uid: invoiceUid as IInvoice["uid"] });

            if(!invoice)
                return res.redirect("back");

            if(invoice.paid)
                return res.redirect("back");

            const links = await createPaypalPaymentFromInvoice(invoice);

            if(!links)
                return res.redirect("back");

            for(const link of links)
                if(link.rel === "approval_url")
                    return res.redirect(link.href);
        });

        this.router.get("/success", async (req, res) =>
        {
            const payerId = req.query.PayerID as string;
            const paymentId = req.query.paymentId as string;

            if(!payerId || !paymentId)
                return res.redirect(await Company_Website());

            retrievePaypalTransaction(payerId, paymentId);

            res.send(`
            <html>
                <head>
                    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                </head>
                <style>
                    body {
                    text-align: center;
                    padding: 40px 0;
                    background: #EBF0F5;
                    }
                    h1 {
                        color: #88B04B;
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-weight: 900;
                        font-size: 40px;
                        margin-bottom: 10px;
                    }
                    p {
                        color: #404F5E;
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-size:20px;
                        margin: 0;
                    }
                    i {
                    color: #9ABC66;
                    font-size: 100px;
                    line-height: 200px;
                    margin-left:-15px;
                    }
                    .card {
                    background: white;
                    padding: 60px;
                    border-radius: 4px;
                    box-shadow: 0 2px 3px #C8D0D8;
                    display: inline-block;
                    margin: 0 auto;
                    }
                </style>
                <body>
                    <div class="card">
                    <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                        <i class="checkmark">✓</i>
                    </div>
                        <h1>Success</h1> 
                        <p>Thanks for the payment!</p>
                    </div>
                </body>
          </html>
            `)
        });

    }

}