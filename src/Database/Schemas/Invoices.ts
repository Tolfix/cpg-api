import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IInvoice } from "../../Interfaces/Invoice";
import Logger from "../../Lib/Logger";

const InvoiceSchema = new Schema
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

// Log when creation
InvoiceSchema.post('save', function(doc: IInvoice)
{
    Logger.db(`Created invoice ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

InvoiceSchema.plugin(increment.plugin, {
    model: 'invoices',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const InvoiceModel = model<IInvoice & Document>("invoices", InvoiceSchema);

export default InvoiceModel;