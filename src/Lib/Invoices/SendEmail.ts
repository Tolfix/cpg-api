import { Document } from "mongoose";
import { Company_Name, Full_Domain } from "../../Config";
import Footer from "../../Email/Templates/General/Footer";
import { ICustomer } from "../../Interfaces/Customer";
import { IInvoice } from "../../Interfaces/Invoice";
import createPDFInvoice from "./CreatePDFInvoice";
import {SendEmail} from "../../Email/Send"
import mainEvent from "../../Events/Main";

export async function sendInvoiceEmail(invoice: IInvoice & Document, Customer: ICustomer): Promise<boolean>
{
    return new Promise(async(resolve) =>
    {

        if(!Customer.personal.email)
            return;
        
        //@ts-ignore
        SendEmail(Customer.personal.email, `Invoice from ${Company_Name !== "" ? Company_Name : "CPG"} #${invoice.id}`, {
            isHTML: true,
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from(await createPDFInvoice(invoice) ?? "==", 'base64'),
                    contentType: 'application/pdf'
                }
            ],
            body: `Dear ${Customer.personal.first_name} ${Customer.personal.last_name} ${Customer.billing.company ? `(${Customer.billing.company})` : ''} <br />
            This is a notice that an invoice has been generated on ${invoice.dates.invoice_date}
            <br />
            <br />
            Your payment method is: ${invoice.payment_method}
            <br />
            <br />
            Invoice id: #<strong>${invoice.id}</strong>. <br />
            Tax due: ${invoice.tax_rate} <br />
            Amount due: ${invoice.amount+invoice.amount*invoice.tax_rate/100} <br />
            Due date: ${invoice.dates.due_date} <br />

            ${invoice.payment_method === "paypal" ? `<br />
            <a href="${Full_Domain}/v2/paypal/pay/${invoice.uid}" target="_blank">
                Click me to pay.
            </a>
            ` : ''}
            ${invoice.payment_method === "credit_card" ? `<br />
            <a href="${Full_Domain}/v2/stripe/pay/${invoice.uid}" target="_blank">
                Click me to pay.
            </a>
            ` : ''}
            <br />
            <strong>Invoice items</strong> <br />
            ${invoice.items.map(item => `<br />
                ${item.notes} <br />
                ${item.quantity} x ${item.amount} = ${item.quantity * item.amount} <br />
            `).join('')}
            <br />
            ${Footer}
            `
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
        SendEmail(Customer.personal.email, `Invoice reminder | ${Company_Name ?? "CPG"} #${invoice.id}`, {
            isHTML: true,
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from(await createPDFInvoice(invoice) ?? "==", 'base64'),
                    contentType: 'application/pdf'
                }
            ],
            body: `Dear ${Customer.personal.first_name} ${Customer.personal.last_name} ${Customer.billing.company ? `(${Customer.billing.company})` : ''} <br />
            This is a notice that invoice ${invoice.id} is late.
            <br />
            <br />
            Your payment method is: ${invoice.payment_method}
            <br />
            <br />
            Invoice id: #<strong>${invoice.id}</strong>. <br />
            Tax due: ${invoice.tax_rate} <br />
            Amount due: ${invoice.amount+invoice.amount*invoice.tax_rate/100} <br />
            Due date: ${invoice.dates.due_date} <br />

            ${invoice.payment_method === "paypal" ? `<br />
            <a href="${Full_Domain}/v2/paypal/pay/${invoice.uid}" target="_blank">
                Click me to pay.
            </a>
            ` : ''}
            ${invoice.payment_method === "credit_card" ? `<br />
            <a href="${Full_Domain}/v2/stripe/pay/${invoice.uid}" target="_blank">
                Click me to pay.
            </a>
            ` : ''}
            <strong>Invoice items</strong> <br />
            ${invoice.items.map(item => `<br />
            ${item.notes} <br />
            ${item.quantity} x ${item.amount} = ${item.quantity * item.amount} <br />
            `).join('')}
            <br />
            ${Footer}
            `
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