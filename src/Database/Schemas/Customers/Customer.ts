import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer";

const CustomerSchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        personal: {
            type: Object,
            required: true,
        },

        billing: {
            type: Object,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        password: {
            type: String,
            required: true,
        },

        extra: {
            type: Object,
            required: false,
        }

    }
);

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

CustomerSchema.plugin(increment.plugin, {
    model: 'customer',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const CustomerModel = model<ICustomer & Document>("customer", CustomerSchema);

export default CustomerModel;