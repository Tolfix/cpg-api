import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { A_OrderStatus, IOrder } from "../../Interfaces/Orders.interface";
import Logger from "../../Lib/Logger";
import GetText from "../../Texts/GetText";
import { A_CC_Payments, A_RecurringMethod } from "../../Types/PaymentMethod";
import { A_PaymentTypes } from "../../Types/PaymentTypes";

const OrderSchema = new Schema
(
    {

        uid: {
            type: String,
            required: false,
            description: GetText().txt_Uid_Description,
        },

        customer_uid: {
            type: String,
            required: true,
        },

        payment_method: {
            type: String,
            enum: [...A_CC_Payments],
            default: "none",
        },

        order_status: {
            type: String,
            enum: [...A_OrderStatus],
            default: "pending",
        },

        products: {
            type: [
                {
                    product_id: Number,
                    configurable_options_ids: {
                        type: [
                            {
                                id: Number,
                                option_index: Number,
                            },
                        ],
                        required: false
                    },
                    quantity: Number,
                }
            ],
            required: true,
        },

        billing_type: {
            type: String,
            enum: [...A_PaymentTypes],
            default: "free",
        },
        
        billing_cycle: {
            type: String,
            enum: [...A_RecurringMethod],
            required: false,
        },
        
        price_override: {
            type: Number,
            defualt: 0,
        },

        dates: {
            type: {
                createdAt: Date,
                last_recycle: {
                    type: String,
                    required: false,
                },
                next_recycle: {
                    type: String,
                    required: false,
                }
            },
            required: true
        },

        invoices: {
            type: [Number],
            default: [],
        },

        promotion_code: {
            type: Number,
            require: false
        },

    }
);

// Log when creation
OrderSchema.post('save', function(doc: IOrder & Document)
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