import express from "express";
import cors from "cors";
import session from "express-session";
import fileUpload from "express-fileupload";
import { Express_Session_Secret, HomeDir, PORT } from "./Config";
import Logger from "./Lib/Logger";
import RouteHandler from "./Handlers/Route";
import { reCache } from "./Cache/reCache";
import { ICustomer } from "./Interfaces/Customer";
import { APIError } from "./Lib/Response";
import { PluginHandler } from "./Plugins/PluginHandler";

declare module "express-session"
{
    interface SessionData {
        payload?: ICustomer;
    }
}

export default function start()
{
    const server = express();
        
    server.use(fileUpload({
        createParentPath: true,
    }));

    server.use(cors({
        origin: "*",
        credentials: true,
    }));
    
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
    
    server.use(express.urlencoded({ extended: true }));
    server.use((req, res, next) => {
        express.json({verify: (req, res, buf, encoding) => { 
            try {
                JSON.parse(buf.toString());
                // @ts-ignore
                req.rawBody = buf;
            } catch (e) {
                // @ts-ignore
                APIError("Invalid JSON")(res);
            }
        }})(req, res, next);
    });
    
    server.use((req, res, next) => {
        res.setHeader('X-Powered-By', 'CPG-API');
        next();
    });
    
    reCache();
    RouteHandler(server);
    PluginHandler(server);

    server.listen(PORT, () => Logger.api(`Server listing on port ${PORT}`));

    server.use("*", (req, res) => {
        return APIError({
            text: `Couldn't find what you were looking for.`
        })(res);
    });
}