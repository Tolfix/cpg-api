/* Copyright (C) 2021 Tolfix - All Rights Reserved */
require("dotenv").config();
import "./Mods/MapMod";
import "./Events/NodeEvents";
import "./Server";
import "./Database/Mongo";
import "./Handlers/Cron";
import AdminHandler from "./Admin/AdminHandler";

new AdminHandler();