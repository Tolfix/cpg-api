import { CronJob } from "cron";
import InvoiceModel from "../Database/Schemas/Invoices";
import Logger from "../Lib/Logger";
import dateFormat from "date-and-time";
import CustomerModel from "../Database/Schemas/Customer";
import { SendEmail } from "../Email/Send";
import easyinvoice from 'easyinvoice';

export default function ReCache()
{
    // Every hour
    new CronJob("0 */12 * * *", () => {
        Logger.info(`Checking invoices..`);

        // Trigger if a invoice is dued in the next 2 weeks.
        // Send email and notify,
        // Mark it as sent notification.
        const getDates14Ahead = () => {
            let dates = [];
            for (let i = 0; i < 14; i++)
                dates.push(dateFormat.format(dateFormat.addDays(new Date(), i+1), "YYYY-MM-DD"))
            return dates;
        }

        InvoiceModel.find({
            "dates.due_date": {
                $in: [...(getDates14Ahead())]
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
                
                var data = {
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
                        "company": Customer.billing.company,
                        "address": Customer.billing.street01,
                        "zip": Customer.billing.postcode,
                        "city": Customer.billing.city,
                        "country": Customer.billing.country
                    },
                    "invoiceNumber": invoice.id,
                    "invoiceDate": invoice.dates.due_date,
                    "products": invoice.items.map((item) => {
                        return {
                            "quantity": "1",
                            "description": item.notes,
                            "tax": "0",
                            "price": item.amount
                        }
                    }),
                    "bottomNotice": "Kindly pay your invoice within 14 days.",
                };
                
                //@ts-ignore
                easyinvoice.createInvoice(data, (result: { pdf: any; }) => {
                    SendEmail(Customer.personal.email, "Invoice From Tolfix", {
                        isHTML: true,
                        attachments: [
                            {
                                filename: 'invoice.pdf',
                                content: Buffer.from(result.pdf ?? "==", 'base64'),
                                contentType: 'application/pdf'
                            }
                        ],
                        body: `Hello ${Customer.personal.first_name} ${Customer.personal.last_name} <br />
                        A gentle reminder you have a invoice due to <strong>${invoice.dates.due_date}</strong> <br />
                        <br />
                        Refrence invoice id <strong>INVOICE ${invoice.id}</strong> when paying!
                        `
                    }, (err, sent) => {
                        if(!err && sent)
                        {
                            invoice.notified = true;
                            invoice.status = "payment_pending";
                            invoice.save();
                        }
                    })
                });

            }
        });

    }, null, true, "Europe/Stockholm");
}