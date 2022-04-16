import { Default_Language, d_Days } from "../../Config";
import OrderModel from "../../Database/Models/Orders.model";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";
import dateFormat from "date-and-time";
import nextRecycleDate from "../../Lib/Dates/DateCycle";
import { createInvoiceFromOrder } from "../../Lib/Orders/newInvoice";
import { InvoiceCreatedReport } from "../../Email/Reports/InvoiceReport";

// Logger.info(`Checking orders..`);
export function cron_createNewInvoicesFromOrders()
{
    Logger.info(GetText(Default_Language).cron.txt_Orders_Checking);
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
}