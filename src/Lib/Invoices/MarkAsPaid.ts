import InvoiceModel from "../../Database/Schemas/Invoices";
import { IInvoice } from "../../Interfaces/Invoice";
import { Document } from "mongoose";

export async function getInvoiceByIdAndMarkAsPaid(id: number | string): Promise<IInvoice & Document>
{
    return new Promise(async (resolve, reject) => {
        const invoice = await InvoiceModel.findOne({ id: id });
        if(!invoice)
            return reject("Unable to find invoice");
    
        if(invoice.paid)
            return reject("Invoice is already paid");

        invoice.paid = true;
        await invoice.save();
        return resolve(invoice);
    }) 
}