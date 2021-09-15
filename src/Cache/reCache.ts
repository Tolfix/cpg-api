import { DebugMode } from "../Config";
import CategoryModel from "../Database/Schemas/Category";
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
            CacheCategories.set(c.uid, c);
        }
        return resolve(true);
    });
}

export async function reCache()
{
    await reCache_Categories();
}