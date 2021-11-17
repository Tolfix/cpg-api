import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IOrder } from "../../Interfaces/Orders";

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

        products_uid: {
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
            default: [],
        },

        promotion_codes: {
            type: Array,
            require: false
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

const OrderModel = model<IOrder & Document>("orders", OrderSchame);

export default OrderModel;