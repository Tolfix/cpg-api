import { ITransactions } from "../Interfaces/Transactions.interface";

/**
 * @deprecated
 */
export const CacheTransactions = new Map<ITransactions["uid"], ITransactions>();