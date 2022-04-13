import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { Default_Language, MongoDB_URI } from "../../Config";
import { IOrder } from "@interface/Orders.interface";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";
import { A_CC_Payments, A_RecurringMethod } from "../../Types/PaymentMethod";
import { currencyCodes } from "../../Lib/Currencies";
import { A_PaymentTypes } from "../../Types/PaymentTypes";


export const A_OrderStatus = [
    "active",
    "pending",
    "fraud",
    "cancelled"
] as const;

const OrderSchema = new Schema
(
    {

        uid: {
            type: String,
            required: false,
            description: GetText(Default_Language).txt_Uid_Description,
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
                    configurable_options: {
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
        
        fees: {
            type: Number,
            default: 0,
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

        currency: {
            type: String,
            enum: currencyCodes,
            default: 'USD',
        },

    },
    {
        timestamps: true,
    }
);

// Log when creation
OrderSchema.post('save', function(doc: IOrder & Document)
{
    Logger.db(GetText(Default_Language).database.txt_Model_Created(doc.modelName, doc.id));
    // Logger.db(`Created order ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

OrderSchema.plugin(increment.plugin, {
    model: 'orders',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

const OrderModel = model<IOrder & Document>("orders", OrderSchema);

export default OrderModel;