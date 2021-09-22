import { IInvoice } from "../Interfaces/Invoice";

export const CacheInvoice = new Map<IInvoice["uid"], IInvoice>();