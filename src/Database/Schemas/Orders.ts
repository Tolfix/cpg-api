import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IOrder } from "../../Interfaces/Orders";
import Logger from "../../Lib/Logger";

const OrderSchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        customer_uid: {
            type: String,
            required: true,
        },

        payment_method: {
            type: String,
            default: "none",
        },

        order_status: {
            type: String,
            default: "pending",
        },

        products: {
            type: Array,
            required: true,
        },

        billing_type: {
            type: String,
            default: "free",
        },
        
        billing_cycle: {
            type: String,
        },
        
        price_override: {
            type: Number,
            defualt: 0,
        },

        dates: {
            type: Object,
            required: true
        },

        invoices: {
            type: Array,
            default: [],
        },

        promotion_code: {
            type: Number,
            require: false
        },

    }
);

// Log when creation
OrderSchema.post('save', function(doc: IOrder)
{
    Logger.db(`Created order ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

OrderSchema.plugin(increment.plugin, {
    model: 'orders',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const OrderModel = model<IOrder & Document>("orders", OrderSchema);

export default OrderModel;