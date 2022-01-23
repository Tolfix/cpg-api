import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs";
import { CacheAdmin, getAdminByUsername } from "../Cache/Admin.cache";
import { APIError } from "../Lib/Response";
import jwt from "jsonwebtoken";
import { JWT_Access_Token } from "../Config";
import Logger from "../Lib/Logger";

export default function EnsureAdmin(req: Request, res: Response, next: NextFunction)
{
    const authHeader = req.headers['authorization'];
    if(!authHeader)
        return APIError("Missing 'authorization' in header")(res);

    const b64auth = (authHeader).split(' ');

    if(!b64auth[0].toLocaleLowerCase().match(/basic|bearer/g))
        return APIError("Missing 'basic' or 'bearer' in authorization")(res);

    if(!b64auth[1])
        return APIError("Missing 'buffer' in authorization")(res);

    if(b64auth[0].toLocaleLowerCase() === "basic")
    {
        // Check if buffer, or base64
        let [login, password] = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString().split(':');
        if(login.includes("==") || password.includes("=="))
        {
            // Assuming base64 string
            // Convert it to normal string
            Logger.error(`Admin authorizing with base64 string`);
            Logger.info(`Encoding admin credentials to normal string`);
            login = atob(login);
            password = login.split(":")[1];
            login = login.split(":")[0];
        }
        
        Logger.warning(`Authoring admin with username: ${login}`);

        return bcrypt.compare(password, (CacheAdmin.get(getAdminByUsername(login) ?? "ADM_")?.["password"]) ?? "", (err, match) =>
        {
            if(!match)
            {
                Logger.warning(`Authorization failed for admin with username: ${login}`);
                return APIError("Unauthorized admin", 403)(res);
            }
    
            return next();
        });
    }

    if(b64auth[0].toLocaleLowerCase() === "bearer")
    {
        const token = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString();
        Logger.warning(`Authoring admin with token: ${token}`);
        jwt.verify(token, JWT_Access_Token, (err, payload) =>
        {
            if(err || !payload)
            {
                Logger.warning(`Authorization failed for admin with token: ${token}`);
                return APIError("Unauthorized admin", 403)(res);
            }

            Logger.warning(`Authorized admin with token: ${token}`);

            return next();
        });
    }
    
    return null;
}