import { CronJob } from "cron";
import { CacheOrder } from "../Cache/CacheOrder";
import Logger from "../Lib/Logger";

export default function ReCache()
{
    // Every hour
    new CronJob("0 */12 * * *", () => {
        Logger.info(`Checking orders..`);

        

    }, null, true, "Europe/Stockholm");
}