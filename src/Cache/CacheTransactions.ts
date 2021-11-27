import { ITransactions } from "../Interfaces/Transactions";

/**
 * @deprecated
 */
export const CacheTransactions = new Map<ITransactions["uid"], ITransactions>();