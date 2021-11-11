import { CronJob } from "cron";
import OrderModel from "../Database/Schemas/Orders";
import Logger from "../Lib/Logger";
import dateFormat from "date-and-time";
import { createInvoiceFromOrder } from "../Lib/Orders/newInvoice";
import nextRecycleDate from "../Lib/Dates/DateCycle";
import { d_Days } from "../Config";

export default function Cron_Orders()
{
    // Every hour
    new CronJob("0 */12 * * *", () => {
        Logger.info(`Checking orders..`);

        // Check if the order needs to create a new invoice if order.dates.next_recylce is withing 14 days
        OrderModel.find().then(orders => {
            orders.forEach(async order => {
                Logger.info(`Checking order ${order.id}`);
                // Check if order.order_status is not "cancelled" or "fruad"
                if(order.order_status.match(/cancelled|fraud/i) === null)
                {
                    if(order.dates.next_recycle)
                    {
                        // Check if the dates are 14 days between
                        if(dateFormat.parse(order.dates.next_recycle, "YYYY-MM-DD").getTime() - new Date().getTime() <= d_Days * 24 * 60 * 60 * 1000)
                        {
                            // Create a new invoice
                            const newInvoice = await createInvoiceFromOrder(order);
                            // Save the invoice in order.invoices array
                            order.invoices.push(newInvoice.id);
                            // Save our last recyle in dates.last_recycle
                            order.dates.last_recycle = order.dates.next_recycle;
                            // Update order.dates.next_recycle
                            order.dates.next_recycle = dateFormat.format(nextRecycleDate(
                                dateFormat.parse(order.dates.next_recycle, "YYYY-MM-DD"), order.billing_cycle ?? "monthly")
                            , "YYYY-MM-DD");
                            // mark order updated in dates
                            order.markModified("dates");
                            // Save the order
                            order.save();
                        }
                    }
                }
            });
        });

    }, null, true, "Europe/Stockholm");
}