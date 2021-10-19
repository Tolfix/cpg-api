import { CronJob } from "cron";
import { CacheInvoice } from "../Cache/CacheInvoices";
import Logger from "../Lib/Logger";

export default function ReCache()
{
    // Every hour
    new CronJob("0 */12 * * *", () => {
        Logger.info(`Checking invoices..`);

        // Trigger if a invoice is dued in the next 2 weeks.
        // Send email and notify,
        // Mark it as sent notification.

        CacheInvoice.forEach((invoice) => {
            if(!invoice.notified)
            {
                // Send email..
            }
        });

    }, null, true, "Europe/Stockholm");
}