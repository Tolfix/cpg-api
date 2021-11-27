import { IInvoice } from "../Interfaces/Invoice";

/**
 * @deprecated
 */
export const CacheInvoice = new Map<IInvoice["uid"], IInvoice>();