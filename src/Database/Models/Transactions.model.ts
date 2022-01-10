import mongoose, { model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IDTransactions } from "../../Interfaces/Transactions.interface";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";
import { A_CC_Payments } from "../../Types/PaymentMethod";

const TransactionsSchema = new Schema
(
    {

        uid: {
            type: String,
            required: false,
            description: GetText().txt_Uid_Description,
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
            enum: [...A_CC_Payments],
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

// Log when a transaction is created
TransactionsSchema.post('save', function(doc: IDTransactions)
{
    Logger.db(`Created transaction ${doc.uid}`);
});

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