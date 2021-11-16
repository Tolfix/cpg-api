import { CronJob } from "cron";
import InvoiceModel from "../Database/Schemas/Invoices";
import Logger from "../Lib/Logger";
import dateFormat from "date-and-time";
import CustomerModel from "../Database/Schemas/Customer";
import { SendEmail } from "../Email/Send";
import createPDFInvoice from "../Lib/Invoices/CreatePDFInvoice";
import { d_Days, Full_Domain } from "../Config";

export default function Cron_Invoices()
{
    // Every hour
    new CronJob("0 */12 * * *", () => {
        Logger.info(`Checking invoices..`);

        // Trigger if a invoice is dued in the next 2 weeks.
        // Send email and notify,
        // Mark it as sent notification.
        const getDates30DaysAhead = () => {
            let dates = [];
            for (let i = 0; i < d_Days; i++)
                dates.push(dateFormat.format(dateFormat.addDays(new Date(), i+1), "YYYY-MM-DD"))
            return dates;
        }

        InvoiceModel.find({
            "dates.due_date": {
                $in: [...(getDates30DaysAhead())]
            },
            notified: false
        }).then(async (invoices) => {
            for await(const invoice of invoices)
            {
                // Get customer
                const Customer = await CustomerModel.findOne({ id: invoice.customer_uid});
                if(!Customer)
                    continue;

                if(!Customer.personal.email)
                    continue;
                
                //@ts-ignore
                SendEmail(Customer.personal.email, `Invoice From Tolfix ${invoice.id}`, {
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
                    `
                }, (err, sent) => {
                    if(!err && sent)
                    {
                        invoice.notified = true;
                        invoice.status = "payment_pending";
                        invoice.save();
                    }
                })

            }
        });

    }, null, true, "Europe/Stockholm");
}