import { IConfigurableOptions } from "@ts/interfaces";
import mongoose, { model, Schema, Document } from "mongoose"
import increment from "mongoose-auto-increment";
import { Default_Language, MongoDB_URI } from "../../Config";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";

const ConfigurableOptionsSchema = new Schema
(
    {

        name: {
            type: String,
            required: true,
        },

        products_ids: {
            type: [Number],
            default: [],
        },

        options: {
            type: [
                {
                    name: String,
                    price: Number,
                }
            ],
            default: [],
        },

    }
);

// Log when creation
ConfigurableOptionsSchema.post('save', function(doc: IConfigurableOptions & Document)
{
    Logger.db(GetText(Default_Language).database.txt_Model_Created(doc.modelName, doc.id));
    // Logger.db(`Created configurable_options ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

ConfigurableOptionsSchema.plugin(increment.plugin, {
    model: 'configurable_options',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const ConfigurableOptionsModel = model<IConfigurableOptions & Document>("configurable_options", ConfigurableOptionsSchema);

export default ConfigurableOptionsModel;