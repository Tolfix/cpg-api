  
import { truncate } from "fs";
import mongoose, { model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IDOrder } from "../../Interfaces/Orders";

const OrderSchame = new Schema
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

        product_uid: {
            type: String,
            required: true,
        },

        billing_type: {
            type: String,
            default: "free",
        },
        
        billing_cycle: {
            type: String,
        },

        quantity: {
            type: Number,
            default: 0,
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
            required: true,
        },

    }
);

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

OrderSchame.plugin(increment.plugin, {
    model: 'orders',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const OrderModel = model<IDOrder>("orders", OrderSchame);

export default OrderModel;