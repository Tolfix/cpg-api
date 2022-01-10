import { ICategory } from "../Interfaces/Categories.interface";

/**
 * @deprecated
 */
export const CacheCategories = new Map<ICategory["uid"], ICategory>();

/**
 * 
 * @param name The name of the category
 * @returns {string|null} The id of category
 */
export const GetCacheCategoryByName = (name: ICategory["name"]) =>
{
    for (const [key, value] of CacheCategories.entries())
    {
        if(value.name === name)
            return key;
    }

    return null;
}