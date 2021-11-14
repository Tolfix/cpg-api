import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { JWT_Access_Token } from "../Config";
import { APIError } from "../Lib/Response";

export default function EnsureAuth()
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader;
        if (token == null)
            return APIError(`Missing token in headers.`, 401)(res);
    
        jwt.verify(token, JWT_Access_Token, (err, payload) =>
        {
            if (err) 
                return APIError(`Unauthorized user.`, 403)(res);

            if(!payload?.data?.id)
                return APIError(`Wrong payload.`, 403)(res);

            //@ts-ignore
            req.customer = payload.data;

            return next();
        });
    }
}