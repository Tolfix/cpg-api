/* Copyright (C) 2021 Tolfix - All Rights Reserved */
require("dotenv").config();
import Logger from "./Lib/Logger";
Logger.info("Starting CPG-API");
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