import { readdirSync } from "fs";
import { HomeDir } from "../Config";
import Logger from "../Lib/Logger";

export default function Cronhandler(): void
{
    let routeDir = HomeDir+"/build/Cron";
    const command = readdirSync(`${routeDir}`).filter((f) => f.endsWith('.js'));
    for (let file of command) {
        Logger.info(`Adding new cron job`);
        const pull = require(`${routeDir}/${file}`).default;
        if(pull)
            pull();
        continue;
    }
}