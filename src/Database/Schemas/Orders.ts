  
import { model, Schema } from "mongoose"
import { IDOrder } from "../../Interfaces/Orders";

const OrderSchame = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        // invoice_uid: {
        //     type: String,
        //     required: false,
        // },

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

    }
);

const OrderModel = model<IDOrder>("orders", OrderSchame);

export default OrderModel;