import { IInvoice } from "@ts/interfaces";

/**
 * @deprecated
 */
export const CacheInvoice = new Map<IInvoice["uid"], IInvoice>();