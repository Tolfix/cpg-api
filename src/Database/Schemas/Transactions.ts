  
import mongoose, { model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IDTransactions } from "../../Interfaces/Transactions";

const TransactionsSchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        customer_uid: {
            type: Number,
            required: true
        },

        invoice_uid: {
            type: Number,
            required: false
        },
        
        date: {
            type: String,
            required: true,
        },

        payment_method: {
            type: String,
            default: 'none',
        },

        amount: {
            type: Number,
            default: 0,
        },

        fees: {
            type: Number,
            default: 0,
        },

    }
);

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

TransactionsSchema.plugin(increment.plugin, {
    model: 'transactions',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const TransactionsModel = model<IDTransactions>("transactions", TransactionsSchema);

export default TransactionsModel;