import { ICustomer } from "../Interfaces/Customer";

/**
 * @deprecated
 */
export const CacheCustomer = new Map<ICustomer["uid"], ICustomer>();