  
import { model, Schema } from "mongoose"
import { IDTransactions } from "../../Interfaces/Transactions";

const TransactionsSchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
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

const TransactionsModel = model<IDTransactions>("transactions", TransactionsSchema);

export default TransactionsModel;