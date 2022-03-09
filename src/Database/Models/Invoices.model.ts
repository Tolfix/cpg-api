import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { Default_Language, MongoDB_URI } from "../../Config";
import { A_InvoiceStatus, IInvoice } from "../../Interfaces/Invoice.interface";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";
import { currencyCodes } from "../../Types/PaymentTypes";

const InvoiceSchema = new Schema
(
    {
        id: Number,
        uid: {
            type: String,
            required: false,
            description: GetText(Default_Language).txt_Uid_Description,
        },

        customer_uid: {
            type: String,
            required: true,
        },

        dates: {
            type: {
                invoice_date: String,
                due_date: String,
            },
            required: true,
        },

        amount: {
            type: Number,
            default: 0,
        },

        items: {
            type: [
                {
                    notes: String,
                    amount: Number,
                    quantity: Number,
                    product_id: {
                        type: Number,
                        required: false,
                    },
                    configurable_options_id: {
                        type: Number,
                        required: false,
                    },
                    configurable_options_index: {
                        type: Number,
                        required: false,
                    }
                }
            ],
            default: []
        },

        transactions: {
            type: [String],
            default: [],
        },

        payment_method: {
            type: String,
            default: "none"
        },

        status: {
            type: String,
            enum: [...A_InvoiceStatus],
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

        currency: {
            type: String,
            enum: currencyCodes,
            default: 'USD',
        },

    }
);

// Log when creation
InvoiceSchema.post('save', function(doc: IInvoice & Document)
{
    Logger.db(GetText(Default_Language).database.txt_Model_Created(doc.modelName, doc.id));
    // Logger.db(`Created invoice ${doc.id}`);
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