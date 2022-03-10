import { ICustomer } from "@interface/Customer.interface";

/**
 * @deprecated
 */
export const CacheCustomer = new Map<ICustomer["uid"], ICustomer>();