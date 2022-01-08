/* Copyright (C) 2022 Tolfix - All Rights Reserved */
require("dotenv").config();
import Logger from "./Lib/Logger";
import { GetVersion } from "./Config";
Logger.info(`Starting CPG-API with version ${GetVersion()}`);
Logger.info("Adding .env variables");
import "./Mods/MapMod";
Logger.info(`Loading ./Mods/MapMod`);
import "./Events/NodeEvents";
Logger.info(`Loading ./Events/NodeEvents`);
import "./Server";
Logger.info(`Loading ./Server`);
import "./Database/Mongo";
Logger.info(`Loading ./Database/Mongo`);
import "./Handlers/Cron";
Logger.info(`Loading ./Handlers/Cron`);
import AdminHandler from "./Admin/AdminHandler";
Logger.info(`Loading ./Admin/AdminHandler`);
new AdminHandler();