import { ITransactions } from "@interface/Transactions.interface";

/**
 * @deprecated
 */
export const CacheTransactions = new Map<ITransactions["uid"], ITransactions>();