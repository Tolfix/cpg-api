import express from "express";
import cors from "cors";
import session from "express-session";
import fileUpload from "express-fileupload";
import { Express_Session_Secret, HomeDir, PORT } from "./Config";
import Logger from "./Lib/Logger";
import RouteHandler from "./Handlers/Route";
import { reCache } from "./Cache/reCache";
import { ICustomer } from "./Interfaces/Customer";
import AdminHandler from "./Admin/AdminHandler";
import { APIError } from "./Lib/Response";

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
    server.use(express.json());
    
    server.use((req, res, next) => {
        // res.setHeader("Content-Type", "application/json");
        res.setHeader('X-Powered-By', 'Tolfix');
        next();
    });
    
    reCache().then(() => {
        RouteHandler(server);
        const sv = server.listen(PORT, () => Logger.info(`Server listing on port ${PORT}`));
        server.use("*", (req, res) => {
            return APIError({
                text: `Couldn't find what you were looking for.`
            })(res);
        })
    });
}