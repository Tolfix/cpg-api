import { Document } from "mongoose";
import { Company_Name } from "../../Config";
import { ICustomer } from "../../Interfaces/Customer.interface";
import { IInvoice } from "../../Interfaces/Invoice.interface";
import createPDFInvoice from "./CreatePDFInvoice";
import {SendEmail} from "../../Email/Send"
import mainEvent from "../../Events/Main.event";
import InvoiceTemplate from "../../Email/Templates/Invoices/Invoice.template";
import LateinvoiceTemplate from "../../Email/Templates/Invoices/Lateinvoice.Template";

export async function sendInvoiceEmail(invoice: IInvoice & Document, Customer: ICustomer): Promise<boolean>
{
    return new Promise(async(resolve) =>
    {

        if(!Customer.personal.email)
            return;
        
        //@ts-ignore
        SendEmail(Customer.personal.email, `Invoice from ${await Company_Name() !== "" ? await Company_Name() : "CPG"} #${invoice.id}`, {
            isHTML: true,
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from(await createPDFInvoice(invoice) ?? "==", 'base64'),
                    contentType: 'application/pdf'
                }
            ],
            body: await InvoiceTemplate(invoice, Customer)
        }, async (err: any, sent: any) =>
        {
            if(!err && sent)
            {
                invoice.notified = true;
                invoice.status = "payment_pending";
                await invoice.save();
                mainEvent.emit("invoice_notified", invoice);
                resolve(true);
            }
            resolve(false);
        });

    });
}

export async function sendLateInvoiceEmail(invoice: IInvoice & Document, Customer: ICustomer)
{
    return new Promise(async(resolve) =>
    {

        if(!Customer.personal.email)
            return;
        
        //@ts-ignore
        SendEmail(Customer.personal.email, `Invoice reminder | ${await Company_Name() ?? "CPG"} #${invoice.id}`, {
            isHTML: true,
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from(await createPDFInvoice(invoice) ?? "==", 'base64'),
                    contentType: 'application/pdf'
                }
            ],
            body: await LateinvoiceTemplate(invoice, Customer)
        }, (err: any, sent: any) =>
        {
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