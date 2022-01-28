import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { JWT_Access_Token } from "../Config";
import Logger from "../Lib/Logger";
import { APIError } from "../Lib/Response";

export default function EnsureAuth()
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        const authHeader = req.headers['authorization'];
        const tokenQuery = req.query.access_token;
        if(!authHeader && !tokenQuery)
            return APIError({
                text: "Missing 'authorization' in header"
            })(res);
    
        let b64auth: string[];
        if(authHeader)
            b64auth = authHeader.split(' ');
    
        if(tokenQuery)
            b64auth = ["query", tokenQuery as string];

        // @ts-ignore
        if(!b64auth[0].toLocaleLowerCase().match(/query|bearer/g))
            return APIError({
                text: "Missing 'basic' or 'bearer' in authorization"
            })(res);

        // @ts-ignore
        if(!b64auth[1])
            return APIError({
                text: "Missing 'buffer' in authorization"
            })(res);
            
        // @ts-ignore
        if(b64auth[0].toLocaleLowerCase() === "bearer" || b64auth[0].toLocaleLowerCase() === "query")
        {
            // @ts-ignore
            const token = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString();
            jwt.verify(token, JWT_Access_Token, (err, payload) =>
            {
                if (err) 
                    return APIError(`Unauthorized user.`, 403)(res);

                // @ts-ignore
                if(!payload?.data?.id)
                    return APIError(`Wrong payload.`, 403)(res);
    
                //@ts-ignore
                req.customer = payload.data;
                // @ts-ignore
                Logger.api(`Authorizing`, payload.data);
    
                return next();
            });
        }
        

    }
}