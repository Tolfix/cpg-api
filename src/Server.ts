/* Copyright (C) 2021 Tolfix - All Rights Reserved */
require("dotenv").config();
require("./Mods/MapMod");
import express from "express";
import cors from "cors";
import session from "express-session";
import { Express_Session_Secret, HomeDir, PORT } from "./Config";
import Logger from "./Lib/Logger";
import RouteHandler from "./Routes/Handler";
import { reCache } from "./Cache/reCache";
import Mongo_Database from "./Database/Mongo";
import { ICustomer } from "./Interfaces/Customer";
import AdminHandler from "./Admin/AdminHandler";
import Swagger from "./Middlewares/Swagger";
import { APIError } from "./Lib/Response";

declare module "express-session"
{
    interface SessionData {
        payload?: ICustomer;
    }
}

const server = express();
new Mongo_Database();
new AdminHandler();

let sessionMiddleWare = session({
    secret: Express_Session_Secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: "/",
        maxAge: 30*24*60*60*1000,
    }
});

server.use(sessionMiddleWare);

server.use(cors({
    origin: true,
    credentials: true
}));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use((req, res, next) => {
    // res.setHeader("Content-Type", "application/json");
    res.setHeader('X-Powered-By', 'Tolfix');
    next();
});

reCache().then(() => {
    RouteHandler(server);
    Swagger(server);
    const sv = server.listen(PORT, () => Logger.info(`Server listing on port ${PORT}`));
    server.use("*", (req, res) => {
        return APIError({
            text: `Couldn't find what you were looking for.`
        })(res);
    })
});
