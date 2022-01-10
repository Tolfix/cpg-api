import { IOrder } from "../Interfaces/Orders.interface";

/**
 * @deprecated
 */
export const CacheOrder = new Map<IOrder["uid"], IOrder>();