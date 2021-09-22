  
import { model, Schema } from "mongoose"
import { IDInvoice } from "../../Interfaces/Invoice";

const InvoiceSchame = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        client_name: {
            type: String,
            required: true,
        },

        invoiced_to: {
            type: Object,
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

    }
);

const InvoiceModel = model<IDInvoice>("invoices", InvoiceSchame);

export default InvoiceModel;