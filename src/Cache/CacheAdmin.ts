import { IAdministrator } from "../Interfaces/Admin/Administrators";

export const CacheAdmin = new Map<IAdministrator["uid"], IAdministrator>();

export function getAdminByUsername(username: IAdministrator["username"])
{
    for (const [key, value] of CacheAdmin.entries())
    {
        if(value.username === username)
            return key;
    }

    return null;
}