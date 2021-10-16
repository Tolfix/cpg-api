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
    let routeDir = HomeDir+"/build/Routes";
    readdirSync(`${routeDir}`).forEach((dir) => {
        const routes = readdirSync(`${routeDir}/${dir}`).filter((f) => f.endsWith('.js'));
        for (let file of routes) {
            const pull = require(`${routeDir}/${dir}/${file}`).default;
            if (pull)
            {
                Logger.info(`Adding new router ${pull.name ?? ""}`)
                new pull(server);
            }
            continue;
        }
    })
}