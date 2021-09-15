import { ICustomer } from "../Interfaces/Customer";

export const CacheCustomer = new Map<ICustomer["uid"], ICustomer>();