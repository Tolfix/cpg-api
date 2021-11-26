import { IInvoice } from "../Invoice";
import { IOrder } from "../Orders";

export interface MainOnEvents
{
    invoice_created: IInvoice;
    invoice_deleted: IInvoice;
    invoice_updated: IInvoice;
    invoice_paid: IInvoice;
    invoice_notified: IInvoice;
    order_created: IOrder;
    order_updated: IOrder;
    order_deleted: IOrder;    
}