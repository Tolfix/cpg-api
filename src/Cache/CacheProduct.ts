import { ICategory } from "../Interfaces/Categories";
import { IProduct } from "../Interfaces/Products";

/**
 * @deprecated
 */
export const CacheProduct = new Map<IProduct["uid"], IProduct>();

export function getProductByCategoryUid(uid: ICategory["uid"])
{
    return CacheProduct.array().filter(e => e.category_uid === uid);
}