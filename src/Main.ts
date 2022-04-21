require("dotenv").config();
// Bad method, will find a better way to do this later
// TODO: Find right amount of max listeners
process.setMaxListeners(0);
import Logger from "./Lib/Logger";
import { DebugMode, GetVersion, CLI_MODE } from "./Config";

Logger.info(!CLI_MODE ? `Starting CPG-API with version ${GetVersion()}` : `Starting CPG-API with version ${GetVersion()} in CLI mode only`);
Logger.info("Adding .env variables");

import "./Mods/Map.mod";
import "./Mods/Number.mod";
import "./Mods/String.mod";

Logger.info(`Loading ./Database/Mongo`);
import "./Database/Mongo";

Logger.info(`Loading ./Events/Node.events`);
import "./Events/Node.events";

!CLI_MODE ? Logger.info(`Loading ./Server`) : null;
!CLI_MODE ? import("./Server/Server") : null;

DebugMode ? Logger.info(`Loading ./Database/Postgres`) : null;
DebugMode ? import("./Database/Postgres") : null;

!CLI_MODE ? Logger.info(`Loading ./Handlers/CronHandler`) : null;
!CLI_MODE ? import("./Handlers/Cron.handler") : null;

import "./Handlers/Commands.handler";

Logger.info(`Loading ./Admin/AdminHandler`);
import AdminHandler from "./Admin/AdminHandler";
new AdminHandler();