import express from "express";
import cors from "cors";
import session from "express-session";
import fileUpload from "express-fileupload";
import { Express_Session_Secret, Full_Domain, PORT } from "../Config";
import Logger from "../Lib/Logger";
import RouteHandler from "../Handlers/Route.handler";
import { reCache } from "../Cache/reCache";
import { ICustomer } from "../Interfaces/Customer.interface";
import { APIError } from "../Lib/Response";
import { PluginHandler } from "../Plugins/PluginHandler";
import ApolloServer from "../Database/GraphQL/ApolloServer";

declare module "express-session"
{
    interface SessionData
    {
        payload?: ICustomer;
    }
}

const server = express();
    
server.use(fileUpload({
    createParentPath: true,
}));

server.use(cors({
    origin: "*",
    credentials: true,
}));

const sessionMiddleWare = session({
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
server.use((req, res, next) => 
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    express.json({verify: (req, res, buf, encoding) =>
    { 
        // Check if content type is application/json
        // And method is POST|PUT|PATCH, since we don't care to look at GET requests
        if(req.headers["content-type"] === "application/json" && req.method?.match(/POST|PATCH|PUT/g))
        {
            // Fix to issue #29
            // https://github.com/Tolfix/cpg-api/issues/29
            // Not good "method" to return node errors to user.
            try
            {
                JSON.parse(buf.toString());
            }
            catch (e)
            {
                // @ts-ignore
                APIError(`Invalid JSON, ${(e.toString())}`)(res);
            }
        }
        
        // @ts-ignore
        req.rawBody = buf;
    }})(req, res, next);
});

server.use((req, res, next) =>
{
    res.setHeader('X-Powered-By', 'CPG-API');
    next();
});

reCache();
RouteHandler(server);
PluginHandler(server);

server.listen(PORT, () => Logger.api(`Server listing on port ${PORT} | ${Full_Domain}`));

(async () =>
    {
        ApolloServer(server);
        server.use("*", (req, res) =>
        {
            return APIError({
                text: `Couldn't find what you were looking for.`
            })(res);
        });
    }
)();