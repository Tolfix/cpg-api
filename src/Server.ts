/*Copyright (C) 2021 Tolfix - All Rights Reserved*/
require("dotenv").config()
import express from "express";
import cors from "cors";
import { PORT } from "./Config";
import Logger from "./Lib/Logger";
import RouteHandler from "./Routes/Handler";
import { reCache } from "./Cache/reCache";
import Mongo_Database from "./Database/Mongo";

const server = express();
new Mongo_Database();

server.use(cors({
    origin: true,
    credentials: true
}));

server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader('X-Powered-By', 'Tolfix');
    next();
});

reCache().then(() => {
    RouteHandler(server);
});

const sv = server.listen(PORT, () => Logger.info(`Server listing on port ${PORT}`));