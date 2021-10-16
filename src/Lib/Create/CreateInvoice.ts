import { CacheInvoice } from "../../Cache/CacheInvoices";
import InvoiceModel from "../../Database/Schemas/Invoices";
import { IInvoice } from "../../Interfaces/Invoice";

export default function createInvoice(data: IInvoice, createPayment?: boolean)
{
    new InvoiceModel(data).save();
    CacheInvoice.set(data.uid, data);

    if(createPayment)
    {
        if(data.payment_method === "manual" || data.payment_method === "none")
            return true;

        // Stripe
        if(data.payment_method === "credit_card")
            return;

        if(data.payment_method === "paypal")
            return;
        
        if(data.payment_method === "swish")
            return;
        
    }

    return true;
}