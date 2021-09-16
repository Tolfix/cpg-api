import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs";
import { CacheAdmin, getAdminByUsername } from "../Cache/CacheAdmin";
import { APIError } from "../Lib/Response";

export default function EnsureAdmin(req: Request, res: Response, next: NextFunction)
{
    const authHeader = req.headers['authorization'];
    if(!authHeader)
        return APIError({
            text: "Missing 'authorization' in header"
        });

    const b64auth = (authHeader).split(' ');

    if(b64auth[0].toLocaleLowerCase() !== "basic")
        return APIError({
            text: "Missing 'basic' in authorization"
        });

    if(!b64auth[1])
        return APIError({
            text: "Missing 'buffer' in authorization"
        });

    const [login, password] = Buffer.from(b64auth[1], 'base64').toString().split(':');

    return bcrypt.compare(password, (CacheAdmin.get(getAdminByUsername(login) ?? "")?.["password"]) ?? "", (err, match) => {
        if(!match)
            return APIError({
                text: "Unauthorized admin"
            }, 403)(res);

        return next();
    });
}