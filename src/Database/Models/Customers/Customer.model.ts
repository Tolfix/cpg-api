import mongoose, { Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { Default_Language, MongoDB_URI } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import Logger from "../../../Lib/Logger";
import GetText from "../../../Translation/GetText";

const CustomerSchema = new Schema
(
    {

        uid: {
            type: String,
            required: false,
            description: GetText(Default_Language).txt_Uid_Description,
        },

        personal: {
            type: {
                first_name: {
                    type: String,
                    required: true
                },
                last_name: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                },
                phone: {
                    type: String,
                    required: true
                },
            },
            required: true,
        },

        billing: {
            type: {
                company: {
                    type: String,
                    required: false
                },
                company_vat: {
                    type: String,
                    required: false
                },
                street01: {
                    type: String,
                    required: true
                },
                street02: {
                    type: String,
                    required: false
                },
                city: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                postcode: {
                    type: String,
                    required: true
                },
                country: {
                    type: String,
                    required: true
                }
            },
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        profile_picture: {
            type: Number,
            ref: "images",
            required: false,
            default: null,
        },

        password: {
            type: String,
            required: true,
        },

        extra: {
            type: Object,
            required: false,
            default: {},
        }

    }
);

// Log when creation
CustomerSchema.post('save', function(doc: ICustomer & Document)
{
    Logger.db(GetText(Default_Language).database.txt_Model_Created(doc.modelName, doc.id));
    // Logger.db(`Created customer ${doc.id}`);
});

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