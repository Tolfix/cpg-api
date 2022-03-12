import { IQuotes } from "@interface/Quotes.interface";
import InvoiceModel from "../../Database/Models/Invoices.model";
import { idInvoice } from "../Generator";
import dateFormat from "date-and-time";
import mainEvent from "../../Events/Main.event";

export default async (quote: IQuotes) =>
{
    // Converts quote to invoice
    const invoice = await (new InvoiceModel({
        uid: idInvoice(),
        customer_uid: quote.customer_uid,
        items: quote.items.map(item => ({
            notes: item.name,
            amount: item.price,
            quantity: item.quantity,
        })),
        dates: {
            invoice_date: dateFormat.format(new Date(), "YYYY-MM-DD"),
            due_date: quote.due_date,
        },
        amount: quote.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        currency: quote.currency,
        tax_rate: quote.tax_rate,
        notified: false,
        transactions: [],
        paid: false,
        notes: quote.memo,
        payment_method: quote.payment_method,
    }).save());

    mainEvent.emit("invoice_created", invoice);

    return invoice;
}