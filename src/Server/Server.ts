import express from "express";
import cors from "cors";
import session from "express-session";
import fileUpload from "express-fileupload";
import { Default_Language, Express_Session_Secret, Full_Domain, PORT } from "../Config";
import Logger from "../Lib/Logger";
import RouteHandler from "../Handlers/Route.handler";
import { reCache } from "../Cache/reCache";
import { ICustomer } from "../Interfaces/Customer.interface";
import { APIError } from "../Lib/Response";
import ApolloServer from "../Database/GraphQL/ApolloServer";
import GetText from "../Translation/GetText";
import rateLimiter from "express-rate-limit"
import EnsureAdmin from "../Middlewares/EnsureAdmin";
import EnsureAuth from "../Middlewares/EnsureAuth";

declare module "express-session"
{
    interface SessionData
    {
        payload?: ICustomer;
    }
}

export const server = express();

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
        if(
            req.headers["content-type"] === "application/json" &&
            req.method?.match(/POST|PATCH|PUT/g) &&
            buf.toString() !== ""
        )
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
    res.setHeader('X-Powered-By', 'cpg-api');
    next();
});

//Limiter, to reduce spam if it would happen.
const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: async (request, response) =>
    {
        if(await EnsureAuth(true)(request,response))
            return 1000;
		if(await EnsureAdmin(true)(request,response))
            return 5000;
        return 500;
	},
    standardHeaders: true,
    message: "Too many requests, please try again later."
});

server.use(limiter);

reCache();
RouteHandler(server);

server.listen(PORT, () => Logger.api(`${GetText(Default_Language).txt_Api_Listing} ${PORT} | ${Full_Domain}`));

(async () =>
    {
        await ApolloServer(server);
        server.use("*", (req, res) =>
        {
            return APIError(GetText(Default_Language).txt_ApiError_default(req))(res);
        });
    }
)();
