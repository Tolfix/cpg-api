import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IQuotes } from "../../Interfaces/Quotes";
import Logger from "../../Lib/Logger";

const QuotesSchema = new Schema
(
    {

        id: Number,

        uid: String,

        customer_uid: {
            type: String,
            required: true,
        },

        items: {
            type: Array,
            required: true,
        },

        promotion_codes: {
            type: Array,
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