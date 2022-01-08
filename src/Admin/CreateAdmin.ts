import bcrypt from "bcryptjs";
import { CacheAdmin, getAdminByUsername } from "../Cache/CacheAdmin";
import AdminModel from "../Database/Models/Administrators.model";
import { idAdmin } from "../Lib/Generator";
import Logger from "../Lib/Logger";

export default function createAdmin(username: string, password: string)
{
    if(CacheAdmin.get(getAdminByUsername(username) ?? 'ADM_'))
        return Logger.warning(`Administrator ${username} already exists`);

    bcrypt.genSalt(10, (err, salt) =>
    {
        bcrypt.hash(password, salt, (err, hash) =>
        {
            if(err)
                return Logger.error(err);

            const info = {
                username,
                password: hash,
                uid: idAdmin(),
                createdAt: new Date()
            };

            new AdminModel(info).save();
            CacheAdmin.set(info.uid, info);
        });
    });
}