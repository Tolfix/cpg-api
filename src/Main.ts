/* Copyright (C) 2021-2022 Tolfix - All Rights Reserved */
require("dotenv").config();
import Logger from "./Lib/Logger";

import { GetVersion } from "./Config";
Logger.info(`Starting CPG-API with version ${GetVersion()}`);
Logger.info("Adding .env variables");

import "./Mods/Map.mod";
import "./Mods/Number.mod";

Logger.info(`Loading ./Events/Node.events`);
import "./Events/Node.events";

Logger.info(`Loading ./Server`);
import "./Server/Server";

Logger.info(`Loading ./Database/Mongo`);
import "./Database/Mongo";

Logger.info(`Loading ./Handlers/CronHandler`);
import "./Handlers/Cron.handler";

import AdminHandler from "./Admin/AdminHandler";
Logger.info(`Loading ./Admin/AdminHandler`);
new AdminHandler();
