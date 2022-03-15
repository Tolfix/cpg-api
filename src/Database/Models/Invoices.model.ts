import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { Default_Language, MongoDB_URI } from "../../Config";
import { extendedOrderStatus, IInvoice, IInvoiceMethods } from "@interface/Invoice.interface";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";
import { currencyCodes, GetCurrencySymbol } from "../../Lib/Currencies";

export const A_InvoiceStatus: extendedOrderStatus[] = [
    "active",
    "pending",
    "draft",
    "fraud",
    "cancelled",
    "refunded",
    "collections",
    "payment_pending",
];

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
                date_refunded: {
                    type: String,
                    default: null
                },
                date_cancelled: {
                    type: String,
                    default: null
                },
                date_paid: {
                    type: String,
                    default: null
                },
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

    },
    {
        timestamps: true,
    }
);

// Add method to invoice
InvoiceSchema.methods.getTotalAmount = function({
    tax = false,
    currency = false,
    symbol = false
}:
{
    tax: boolean;
    currency: boolean;
    symbol: boolean;
})
{
    const _ = this as unknown as IInvoice;
    const total = _.items.reduce((total, item) => total + item.amount, 0);
    if(currency)
        return `${tax ? total + total * _.tax_rate/100 : total} ${symbol ? GetCurrencySymbol(_.currency) : _.currency}`;
    return tax ? total + total * _.tax_rate/100 : total;
}

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
    startAt: 1,
    incrementBy: 1
});

const InvoiceModel = model<IInvoice & IInvoiceMethods & Document>("invoices", InvoiceSchema);

export default InvoiceModel;