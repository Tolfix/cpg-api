import { ITransactions } from "../Interfaces/Transactions";

export const CacheTransactions = new Map<ITransactions["uid"], ITransactions>();