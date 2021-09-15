import { Application } from "express";
import { readdirSync } from "fs";
import { HomeDir } from "../Config";
import Logger from "../Lib/Logger";

/**
 * 
 * @param {Application} server The server from express
 * @description
 * Handles all routes dynamic
 */
export default function RouteHandler(server: Application): void
{
    let commandDir = HomeDir+"/build/Routes";
    const command = readdirSync(`${commandDir}`).filter((f) => f.endsWith('.js'));
    for (let file of command) {
        if(file !== "Handler.js")
        {
            const pull = require(`${commandDir}/${file}`).default;
            if (pull) {
                Logger.info(`Adding new router ${pull.name ?? ""}`)
                new pull(server);
            }
        }
        continue;
    }
}