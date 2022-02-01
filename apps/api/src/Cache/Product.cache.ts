import { ICategory, IProduct } from "@ts/interfaces";

/**
 * @deprecated
 */
export const CacheProduct = new Map<IProduct["uid"], IProduct>();

export function getProductByCategoryUid(uid: ICategory["uid"])
{
    return CacheProduct.array().filter(e => e.category_uid === uid);
}