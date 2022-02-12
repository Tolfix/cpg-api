/* Copyright (C) 2021-2022 Tolfix - All Rights Reserved */
require("dotenv").config();
import Logger from "./Lib/Logger";
import { DebugMode, GetVersion } from "./Config";

Logger.info(`Starting CPG-API with version ${GetVersion()}`);
Logger.info("Adding .env variables");

import "./Mods/Map.mod";
import "./Mods/Number.mod";
import "./Mods/String.mod";

Logger.info(`Loading ./Events/Node.events`);
import "./Events/Node.events";

Logger.info(`Loading ./Server`);
import "./Server/Server";

Logger.info(`Loading ./Database/Mongo`);
import "./Database/Mongo";

DebugMode ? Logger.info(`Loading ./Database/Postgres`) : null;
DebugMode ? import("./Database/Postgres") : null;

Logger.info(`Loading ./Handlers/CronHandler`);
import "./Handlers/Cron.handler";

Logger.info(`Loading ./Admin/AdminHandler`);
import AdminHandler from "./Admin/AdminHandler";
new AdminHandler();

Logger.info(`Loading ./Plugins/PluginHandler`);
import "./Plugins/PluginHandler";