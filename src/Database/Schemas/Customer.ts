  
import { model, Schema } from "mongoose"
import { IDCustomer } from "../../Interfaces/Customer";

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

        extra: {
            type: Object,
            required: false,
        }

    }
);

const CustomerModel = model<IDCustomer>("customer", CustomerSchema);

export default CustomerModel;