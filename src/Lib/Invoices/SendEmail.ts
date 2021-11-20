import { Document } from "mongoose";
import { Full_Domain } from "../../Config";
import Footer from "../../Email/Templates/General/Footer";
import { ICustomer } from "../../Interfaces/Customer";
import { IInvoice } from "../../Interfaces/Invoice";
import createPDFInvoice from "./CreatePDFInvoice";
import {SendEmail} from "../../Email/Send"

export async function sendInvoiceEmail(invoice: IInvoice & Document, Customer: ICustomer)
{
    return new Promise(async(resolve, reject) => {

        if(!Customer.personal.email)
            return;
        
        //@ts-ignore
        SendEmail(Customer.personal.email, `Invoice from Tolfix ${invoice.id}`, {
            isHTML: true,
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from(await createPDFInvoice(invoice) ?? "==", 'base64'),
                    contentType: 'application/pdf'
                }
            ],
            body: `Hello ${Customer.personal.first_name} ${Customer.personal.last_name} <br />
            A gentle reminder you have a invoice due to <strong>${invoice.dates.due_date}</strong> <br />
            <br />
            Reference invoice id <strong>INVOICE ${invoice.id}</strong> when paying!
            <br />
            <br />
            Payment method: ${invoice.payment_method}
            ${invoice.payment_method === "paypal" ? `<br />
            <a href="${Full_Domain}/v2/paypal/pay/${invoice.uid}" target="_blank">
                Click me to pay.
            </a>
            ` : ''}
            <br />
            <br />
            Company information : <a href="https://tolfix.com/knowledgebase">https://tolfix.com/knowledgebase</a>
            <br />
            Company Billing : <a href="https://tolfix.com/about/billing">https://tolfix.com/about/billing</a>
            <br />
            <br />
            ${Footer}
            `
        }, (err: any, sent: any) => {
            if(!err && sent)
            {
                invoice.notified = true;
                invoice.status = "payment_pending";
                invoice.save();
            }
        });

        resolve(true);
    });
}