import { CronJob } from "cron";
import OrderModel from "../Database/Models/Orders";
import Logger from "../Lib/Logger";
import dateFormat from "date-and-time";
import { createInvoiceFromOrder } from "../Lib/Orders/newInvoice";
import nextRecycleDate from "../Lib/Dates/DateCycle";
import { d_Days } from "../Config";
import { InvoiceCreatedReport } from "../Email/Reports/InvoiceReport";

export default function Cron_Orders()
{
    // Every hour
    new CronJob("0 */12 * * *", () => {
        Logger.info(`Checking orders..`);

        // Check if the order needs to create a new invoice if order.dates.next_recylce is withing 14 days
        OrderModel.find({
            order_status: "active",
        }).then(async orders => {
            let newInvoices = [];
            // orders.forEach(async order => {
            for await(let order of orders)
            {
                Logger.info(`Checking order ${order.id}`);
                // Check if order.order_status is not "cancelled" or "fruad"
                if(order.order_status.match(/cancelled|fraud/i) === null)
                {
                    if(order.dates.next_recycle)
                    {
                        // Check if the dates are 14 days between
                        if(dateFormat.parse(order.dates.next_recycle, "YYYY-MM-DD").getTime() - new Date().getTime() <= d_Days * 24 * 60 * 60 * 1000)
                        {
                            const temptNextRecycle = order.dates.next_recycle;
                            order.dates.last_recycle = temptNextRecycle;
                            // Update order.dates.next_recycle
                            order.dates.next_recycle = dateFormat.format(nextRecycleDate(
                                dateFormat.parse(temptNextRecycle, "YYYY-MM-DD"), order.billing_cycle ?? "monthly")
                            , "YYYY-MM-DD");
                            // Create a new invoice
                            const newInvoice = await createInvoiceFromOrder(order);
                            newInvoices.push(newInvoice);
                            // Save the invoice in order.invoices array
                            order.invoices.push(newInvoice.id);
                            
                            // mark order updated in dates
                            order.markModified("dates");
                            // Save the order
                            order.save();
                        }
                    }
                }
                if(newInvoices.length > 0)
                    InvoiceCreatedReport(newInvoices);
            };
        });

    }, null, true, "Europe/Stockholm");
}