import { CronJob } from "cron";
import OrderModel from "../Database/Models/Orders.model";
import Logger from "../Lib/Logger";
import dateFormat from "date-and-time";
import { createInvoiceFromOrder } from "../Lib/Orders/newInvoice";
import nextRecycleDate from "../Lib/Dates/DateCycle";
import { Default_Language, d_Days } from "../Config";
import { InvoiceCreatedReport } from "../Email/Reports/InvoiceReport";
import GetText from "../Translation/GetText";

export = function Cron_Orders()
{
    // Every hour
    new CronJob("0 12 * * *", () =>
    {
        Logger.info(GetText(Default_Language).cron.txt_Orders_Checking);
        // Logger.info(`Checking orders..`);

        // Check if the order needs to create a new invoice if order.dates.next_recycle is withing 14 days
        OrderModel.find({
            order_status: "active",
            // order_status: {
            //     $not: /fraud|cancelled|draft|refunded/g
            // }
        }).then(async orders =>
        {
            const newInvoices = [];
            // orders.forEach(async order => {
            for await(const order of orders)
            {
                Logger.info(GetText(Default_Language).cron.txt_Order_Checking(order.id));
                // Logger.info(`Checking order ${order.id}`);
                // Check if order.order_status is not "cancelled" or "fraud"
                if(order.dates.next_recycle)
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
                        order.markModified("invoices");
                        // Save the order
                        await order.save();
                    }
                if(newInvoices.length > 0)
                    await InvoiceCreatedReport(newInvoices);
            }
        });

    }, null, true, "Europe/Stockholm");
}