/* Copyright (C) 2021 Tolfix - All Rights Reserved */
require("dotenv").config();
require("./Mods/MapMod");
import NodeEvents from "./Events/NodeEvents";
import start from "./Server";
import Mongo_Database from "./Database/Mongo";
import AdminHandler from "./Admin/AdminHandler";

new Mongo_Database();
new AdminHandler();
NodeEvents();
start();