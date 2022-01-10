import { IInvoice } from "../Interfaces/Invoice.interface";

/**
 * @deprecated
 */
export const CacheInvoice = new Map<IInvoice["uid"], IInvoice>();