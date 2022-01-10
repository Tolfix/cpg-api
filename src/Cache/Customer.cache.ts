import { ICustomer } from "../Interfaces/Customer.interface";

/**
 * @deprecated
 */
export const CacheCustomer = new Map<ICustomer["uid"], ICustomer>();