import { IOrder } from "@interface/Orders.interface";

/**
 * @deprecated
 */
export const CacheOrder = new Map<IOrder["uid"], IOrder>();