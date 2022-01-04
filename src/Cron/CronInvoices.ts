import { CronJob } from "cron";
import InvoiceModel from "../Database/Models/Invoices";
import Logger from "../Lib/Logger";
import dateFormat from "date-and-time";
import CustomerModel from "../Database/Models/Customers/Customer";
import { d_Days } from "../Config";
import { sendInvoiceEmail, sendLateInvoiceEmail } from "../Lib/Invoices/SendEmail";
import { InvoiceNotifiedReport } from "../Email/Reports/InvoiceReport";

export default function Cron_Invoices()
{
    // Every hour
    new CronJob("0 */12 * * *", () => {
        Logger.info(`Checking invoices..`);

        // Trigger if a invoice is dued in the next 2 weeks.
        // Send email and notify,
        // Mark it as sent notification.
        const getDates30DaysAhead = () =>
        {
            let dates = [];
            for (let i = 0; i < d_Days; i++)
                dates.push(dateFormat.format(dateFormat.addDays(new Date(), i+1), "YYYY-MM-DD"))
            return dates;
        };

        const getDates30DaysAgo = () =>
        {
            let dates = [];
            for (let i = 0; i < d_Days; i++)
                dates.push(dateFormat.format(dateFormat.addDays(new Date(), -i-1), "YYYY-MM-DD"))
            return dates;
        };

        InvoiceModel.find({
            "dates.due_date": {
                $in: [...(getDates30DaysAhead())]
            },
            notified: false,
            status: {
                $not: /fraud|cancelled/g
            }
        }).then(async (invoices) => {
            Logger.info(`Found ${invoices.length} invoices to notify.`);
            for await(const invoice of invoices)
            {
                // Get customer
                const Customer = await CustomerModel.findOne({ id: invoice.customer_uid});
                if(!Customer)
                    continue;
                    
                Logger.info(`Sending email to ${Customer.personal.email}`);

                await sendInvoiceEmail(invoice, Customer);

            }
            if(invoices.length > 0)
                InvoiceNotifiedReport(invoices);
        });

        InvoiceModel.find({
            "dates.due_date": {
                $in: [...(getDates30DaysAgo())]
            },
            paid: false,
            status: {
                $not: /fraud|cancelled/g
            }
        }).then(async (invoices) => {
            for await(const invoice of invoices)
            {
                // Get customer
                const Customer = await CustomerModel.findOne({ id: invoice.customer_uid});
                if(!Customer)
                    continue;

                await sendLateInvoiceEmail(invoice, Customer);

            }
        });

    }, null, true, "Europe/Stockholm");
}