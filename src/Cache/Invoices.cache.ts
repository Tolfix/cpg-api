import { IInvoice } from "@interface/Invoice.interface";

/**
 * @deprecated
 */
export const CacheInvoice = new Map<IInvoice["uid"], IInvoice>();