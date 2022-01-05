import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IQuotes } from "../../Interfaces/Quotes";
import Logger from "../../Lib/Logger";
import { A_CC_Payments } from "../../Types/PaymentMethod";

const QuotesSchema = new Schema
(
    {

        id: Number,

        uid: {
            type: String,
            required: false,
        },

        customer_uid: {
            type: String,
            required: true,
        },

        items: {
            type: [
                {
                    name: String,
                    tax_rate: Number,
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
    Logger.db(`Created Quotes ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

QuotesSchema.plugin(increment.plugin, {
    model: 'quotes',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const QuotesModel = model<IQuotes & Document>("quotes", QuotesSchema);

export default QuotesModel;