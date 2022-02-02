import mongoose, { model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { Default_Language, MongoDB_URI } from "../../Config";
import { IDCategory } from "../../Interfaces/Categories.interface";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";

const CategorySchema = new Schema
(
    {

        uid: {
            type: String,
            required: false,
            description: GetText(Default_Language).txt_Uid_Description,
        },

        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        image: {
            type: [Number],
            default: [],
        },

        private: {
            type: Boolean,
            required: true,
        },

    }
);

// Log when creation
CategorySchema.post('save', function(doc: IDCategory & Document)
{
    Logger.db(GetText(Default_Language).database.txt_Model_Created(doc.modelName, doc.id));
    // Logger.db(`Created category ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

CategorySchema.plugin(increment.plugin, {
    model: 'category',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const CategoryModel = model<IDCategory>("category", CategorySchema);

export default CategoryModel;