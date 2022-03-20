import { IInvoice } from "@interface/Invoice.interface";

export const CacheInvoice = new Map<IInvoice["uid"], IInvoice>();