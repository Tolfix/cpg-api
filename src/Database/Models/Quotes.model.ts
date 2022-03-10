import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { Default_Language, MongoDB_URI } from "../../Config";
import { IQuotes } from "@interface/Quotes.interface";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";
import { A_CC_Payments } from "../../Types/PaymentMethod";
import { currencyCodes } from "../../Lib/Currencies";

const QuotesSchema = new Schema
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

        items: {
            type: [
                {
                    name: String,
                    price: Number,
                    quantity: Number,
                }
            ],
            required: true,
        },

        promotion_codes: {
            type: [Number],
            default: []
        },

        due_date: {
            type: String,
            required: true,
        },

        memo: {
            type: String,
            default: "",
        },

        currency: {
            type: String,
            required: true,
            enum: currencyCodes,
            default: "EUR",
        },

        tax_rate: {
            type: Number,
            default: 0,
        },

        accepted: {
            type: Boolean,
            default: false
        },

        declined: {
            type: Boolean,
            default: false
        },

        payment_method: {
            type: String,
            enum: [...A_CC_Payments],
            default: "none",
        }

    }
);

// Log when creation
QuotesSchema.post('save', function(doc: IQuotes & Document)
{
    Logger.db(GetText(Default_Language).database.txt_Model_Created(doc.modelName, doc.uid));
    // Logger.db(`Created Quotes ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

QuotesSchema.plugin(increment.plugin, {
    model: 'quotes',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

const QuotesModel = model<IQuotes & Document>("quotes", QuotesSchema);

export default QuotesModel;