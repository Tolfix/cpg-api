import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs";
import { CacheAdmin, getAdminByUsername } from "../Cache/Admin.cache";
import { APIError } from "../Lib/Response";
import jwt from "jsonwebtoken";
import { JWT_Access_Token } from "../Config";
import Logger from "../Lib/Logger";

export default function EnsureAdmin(eR = false)
{
    return async (req: Request, res: Response, next?: NextFunction) =>
    {

        const authHeader = req.headers['authorization'];
        const tokenQuery = req.query.access_token;
        if (!authHeader && !tokenQuery)
            return eR ? Promise.resolve(false) : APIError({
                text: "Missing 'authorization' in header"
            })(res);
    
        let b64auth: string[];
        if (authHeader)
            b64auth = authHeader.split(' ');
    
        if (tokenQuery)
            b64auth = ["query", tokenQuery as string];
    
        // @ts-ignore
        if (!b64auth[0].toLocaleLowerCase().match(/basic|bearer|query/g))
            return eR ? Promise.resolve(false) : APIError("Missing 'basic' or 'bearer' in authorization")(res);
            
        // @ts-ignore
        if (!b64auth[1])
            return eR ? Promise.resolve(false) : APIError("Missing 'buffer' in authorization")(res);
        
        // @ts-ignore
        if (b64auth[0].toLocaleLowerCase() === "basic")
        {
            // Check if buffer, or base64
            // @ts-ignore
            let [login, password] = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString().split(':');
            if (login.includes("==") || password.includes("=="))
            {
                // Assuming base64 string
                // Convert it to normal string
                Logger.error(`Admin authorizing with base64 string`);
                Logger.info(`Encoding admin credentials to normal string`);
                //login = atob(login);
                login = Buffer.from(login, 'base64').toString();
                password = login.split(":")[1];
                login = login.split(":")[0];
            }

            !eR ? Logger.warning(`Authoring admin with username: ${login}`) : null;

            const match = await bcrypt.compare(password, (CacheAdmin.get(getAdminByUsername(login) ?? "ADM_")?.["password"]) ?? "");

            if (!match)
            {
                !eR ? Logger.warning(`Authorization failed for admin with username: ${login}`) : null;
                return eR ? Promise.resolve(false) : APIError("Unauthorized admin", 403)(res);
            }
    
            return eR ? Promise.resolve(true) : next?.();
        }
    
        // @ts-ignore
        if (b64auth[0].toLocaleLowerCase() === "bearer" || b64auth[0].toLocaleLowerCase() === "query")
        {
            // @ts-ignore
            const token = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString();
            
            !eR ? Logger.warning(`Authoring admin with token: ${token}`) : null;

            try
            {
                const payload = jwt.verify(token, JWT_Access_Token);
                
                if (!payload)
                {
                    !eR ? Logger.warning(`Authorization failed for admin with token: ${token}`) : null;
                    return eR ? Promise.resolve(false) : APIError("Unauthorized admin", 403)(res);
                }
    
                eR ? Logger.warning(`Authorized admin with token: ${token}`) : null;
    
                return eR ? Promise.resolve(true) : next?.();
            }
            catch (e)
            {
                return eR ? Promise.resolve(false) : APIError("JWT token expired or bad", 403)(res);
            }
        }

        return Promise.resolve(false);
    }
}