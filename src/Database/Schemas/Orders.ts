  
import { model, Schema } from "mongoose"
import { IDOrder } from "../../Interfaces/Orders";

const OrderSchame = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        invoice_uid: {
            type: String,
            required: true,
        },

        customer_uid: {
            type: String,
            required: true,
        },

        payment_method: {
            type: String,
            required: true,
        },

        order_status: {
            type: String,
            required: true,
        },

        product_uid: {
            type: String,
            required: true,
        },

        billing_type: {
            type: String,
            required: true,
        },
        
        billing_cycle: {
            type: String,
            default: "",
        },

        quantity: {
            type: Number,
            default: 0,
        },

        price_override: {
            type: Number,
            defualt: 0,
        },

    }
);

const OrderModel = model<IDOrder>("orders", OrderSchame);

export default OrderModel;