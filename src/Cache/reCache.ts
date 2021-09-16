import { DebugMode } from "../Config";
import AdminModel from "../Database/Schemas/Administrators";
import CategoryModel from "../Database/Schemas/Category";
import Logger from "../Lib/Logger";
import { CacheAdmin } from "./CacheAdmin";
import { CacheCategories } from "./CacheCategories";

export function reCache_Categories()
{
    if(DebugMode)
    {
        CacheCategories.set("0", {
            description: "Testing",
            name: "Test",
            private: true,
            uid: "0",
        });
        CacheCategories.set("1", {
            description: "Testing",
            name: "Test",
            private: true,
            uid: "1",
        });
    }

    return new Promise(async (resolve, reject) => {
        const categories = await CategoryModel.find();
        for (const c of categories)
        {
            Logger.cache(`Caching category ${c.uid}`);
            CacheCategories.set(c.uid, c);
        }
        return resolve(true);
    });
}

export async function reCache_Admin()
{
    return new Promise(async (resolve, reject) => {
        const admin = await AdminModel.find();
        for (const a of admin)
        {
            Logger.cache(`Caching admin ${a.uid}`);
            CacheAdmin.set(a.uid, a);
        }
        return resolve(true);
    });
}

export async function reCache()
{
    await reCache_Categories();
    await reCache_Admin();
}