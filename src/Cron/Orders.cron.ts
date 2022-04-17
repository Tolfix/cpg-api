import { CronJob } from "cron";
import { cron_createNewInvoicesFromOrders } from "./Methods/Orders.cron.methods";

export = function Cron_Orders()
{
    // Every hour
    new CronJob("0 12 * * *", () =>
    {
        cron_createNewInvoicesFromOrders();
    }, null, true, "Europe/Stockholm");
}