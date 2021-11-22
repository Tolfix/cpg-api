import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import mainEvent from "../../Events/Main";
import { IInvoice } from "../../Interfaces/Invoice";

const InvoiceSchame = new Schema
(
    {
        id: Number,
        uid: {
            type: String,
            required: true,
        },

        customer_uid: {
            type: String,
            required: true,
        },

        dates: {
            type: Object,
            required: true,
        },

        amount: {
            type: Number,
            default: 0,
        },

        items: {
            type: Array,
            default: []
        },

        transactions: {
            type: Array,
            default: [],
        },

        payment_method: {
            type: String,
            default: "none"
        },

        status: {
            type: String,
            default: "draft",
        },

        tax_rate: {
            type: Number,
            default: 0
        },

        notes: {
            type: String,
            default: 0
        },

        paid: {
            type: Boolean,
            default: false,
        },

        notified: {
            type: Boolean,
            default: false,
        },

    }
);

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

InvoiceSchame.plugin(increment.plugin, {
    model: 'invoices',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

// Emit event when a new invoice is created
InvoiceSchame.post("save", function(invoice: IInvoice)
{
    mainEvent.emit("invoice_created", invoice);
});

// Emit event when an invoice is updated
InvoiceSchame.post("update", function(invoice: IInvoice)
{
    mainEvent.emit("invoice_updated", invoice);
});

// Emit event when an invoice is deleted
InvoiceSchame.post("remove", function(invoice: IInvoice)
{
    mainEvent.emit("invoice_deleted", invoice);
});

const InvoiceModel = model<IInvoice & Document>("invoices", InvoiceSchame);

export default InvoiceModel;