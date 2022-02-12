import { CronJob } from "cron";
import InvoiceModel from "../Database/Models/Invoices.model";
import Logger from "../Lib/Logger";
import dateFormat from "date-and-time";
import CustomerModel from "../Database/Models/Customers/Customer.model";
import { Default_Language, d_Days } from "../Config";
import { sendInvoiceEmail, sendLateInvoiceEmail } from "../Lib/Invoices/SendEmail";
import { InvoiceNotifiedReport } from "../Email/Reports/InvoiceReport";
import GetText from "../Translation/GetText";
import { ChargeCustomer } from "../Payments/Stripe";

export = function Cron_Invoices()
{
    // Every hour
    new CronJob("0 */12 * * *", () =>
    {
        Logger.info(GetText(Default_Language).cron.txt_Invoice_Checking);

        // Trigger if a invoice is dued in the next 2 weeks.
        // Send email and notify,
        // Mark it as sent notification.
        const getDates30DaysAhead = () =>
        {
            const dates = [];
            for (let i = 0; i < d_Days; i++)
                dates.push(dateFormat.format(dateFormat.addDays(new Date(), i+1), "YYYY-MM-DD"))
            return dates;
        };

        const getDates30DaysAgo = () =>
        {
            const dates = [];
            for (let i = 0; i < d_Days; i++)
                dates.push(dateFormat.format(dateFormat.addDays(new Date(), -i-1), "YYYY-MM-DD"))
            return dates;
        };

        const getDatesAhead = (n: number) =>
        {
            const dates = [];
            for (let i = 0; i < n; i++)
                dates.push(dateFormat.format(dateFormat.addDays(new Date(), -i-1), "YYYY-MM-DD"))
            return dates;
        }

        InvoiceModel.find({
            "dates.due_date": {
                $in: [...(getDates30DaysAhead())]
            },
            notified: false,
            status: {
                $not: /fraud|cancelled|draft|refunded/g
            }
        }).then(async (invoices) =>
        {
            Logger.info(GetText(Default_Language).cron.txt_Invoice_Found_Notify(invoices.length));
            // Logger.info(`Found ${invoices.length} invoices to notify.`);
            for await(const invoice of invoices)
            {
                // Get customer
                const Customer = await CustomerModel.findOne({ id: invoice.customer_uid});
                if(!Customer)
                    continue;
                
                Logger.info(GetText(Default_Language).cron.txt_Invoice_Found_Sending_Email(Customer));
                // Logger.info(`Sending email to ${Customer.personal.email}`);

                await sendInvoiceEmail(invoice, Customer);

            }
            if(invoices.length > 0)
                InvoiceNotifiedReport(invoices);
        });

        // Trigger if a invoice has stripe_setup_intent enabled and is due in the next 2 weeks.
        InvoiceModel.find({
            "dates.due_date": {
                $in: [...(getDatesAhead(14))]
            },
            status: {
                $not: /fraud|cancelled|draft|refunded/g
            },
            paid: false,
            "extra.stripe_setup_intent": true
        }).then(async (invoices) =>
        {
            Logger.info(`Found ${invoices.length} invoices to charge.`);
            for await(const invoice of invoices)
            {
                // Get customer
                const Customer = await CustomerModel.findOne({ id: invoice.customer_uid});
                if(!Customer)
                    continue;
                
                Logger.info(`Charging ${Customer.personal.email}`);

                // Check if credit card
                if(invoice.payment_method !== "credit_card")
                    continue;

                // Check if customer got setup_intent enabled
                if(!(Customer?.extra?.stripe_setup_intent))
                    continue;

                // Assuming they have a card
                // Try to create a payment intent and pay
                try
                {
                    await ChargeCustomer(invoice.id);
                    // assuming it worked, we can mark it as paid
                    invoice.status = "collections";
                    invoice.paid = true;
                    invoice.notified = true;
                    await invoice.save();
                }
                catch(e)
                {
                    Logger.error(`Failed to charge customer ${Customer.id}`);
                }
            }
        });

        InvoiceModel.find({
            "dates.due_date": {
                $in: [...(getDates30DaysAgo())]
            },
            paid: false,
            status: {
                $not: /fraud|cancelled|draft|refunded/g
            }
        }).then(async (invoices) =>
        {
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