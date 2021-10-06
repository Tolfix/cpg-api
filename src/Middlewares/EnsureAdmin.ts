import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs";
import { CacheAdmin, getAdminByUsername } from "../Cache/CacheAdmin";
import { APIError } from "../Lib/Response";
import jwt from "jsonwebtoken";
import { JWT_Access_Token } from "../Config";
import Logger from "../Lib/Logger";

export default function EnsureAdmin(req: Request, res: Response, next: NextFunction)
{
    const authHeader = req.headers['authorization'];
    if(!authHeader)
        return APIError({
            text: "Missing 'authorization' in header"
        })(res);

    const b64auth = (authHeader).split(' ');

    if(!b64auth[0].toLocaleLowerCase().match(/basic|bearer/g))
        return APIError({
            text: "Missing 'basic' or 'bearer' in authorization"
        })(res);

    if(!b64auth[1])
        return APIError({
            text: "Missing 'buffer' in authorization"
        })(res);

    if(b64auth[0].toLocaleLowerCase() === "basic")
    {
        const [login, password] = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString().split(':');

        return bcrypt.compare(password, (CacheAdmin.get(getAdminByUsername(login) ?? "ADM_")?.["password"]) ?? "", (err, match) => {
            if(!match)
                return APIError({
                    text: "Unauthorized admin"
                }, 403)(res);
    
            return next();
        });
    }

    if(b64auth[0].toLocaleLowerCase() === "bearer")
    {
        const token = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString();
        jwt.verify(token, JWT_Access_Token, (err, payload) => {
            if(err || !payload)
                return APIError({
                    text: "Unauthorized"
                }, 403)(res);
            Logger.debug(payload)
            return next();
        });
    }
    
    return null;
}