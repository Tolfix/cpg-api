import { IOrder } from "../Interfaces/Orders";

export const CacheOrder = new Map<IOrder["uid"], IOrder>();