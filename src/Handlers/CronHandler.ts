import { readdirSync } from "fs";
import { HomeDir } from "../Config";
import Logger from "../Lib/Logger";

const routeDir = HomeDir+"/build/Cron";
const command = readdirSync(`${routeDir}`).filter((f) => f.endsWith('cron.js'));
for (const file of command)
{
    Logger.info(`Adding new cron job`);
    const pull = require(`${routeDir}/${file}`).default;
    if(pull)
        pull();
    continue;
}