import { ICustomer } from "@ts/interfaces";

/**
 * @deprecated
 */
export const CacheCustomer = new Map<ICustomer["uid"], ICustomer>();