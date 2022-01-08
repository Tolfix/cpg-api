import InvoiceModel from "../../Database/Models/Invoices.model";
import { IInvoice } from "../../Interfaces/Invoice";
import { Document } from "mongoose";
import mainEvent from "../../Events/Main";

export async function getInvoiceByIdAndMarkAsPaid(id: number | string): Promise<IInvoice & Document>
{
    return new Promise(async (resolve, reject) =>
    {
        const invoice = await InvoiceModel.findOne({ id: id });
        if(!invoice)
            return reject("Unable to find invoice");
    
        if(invoice.paid)
            return reject("Invoice is already paid");

        invoice.paid = true;
        await invoice.save();
        // emit event as invoice is paid
        mainEvent.emit("invoice_paid", invoice);
        return resolve(invoice);
    });
}