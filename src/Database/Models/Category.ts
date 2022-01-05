import mongoose, { model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IDCategory } from "../../Interfaces/Categories";
import Logger from "../../Lib/Logger";
import { txt_Uid_Description } from "../../Texts/General/Uid";

const CategorySchema = new Schema
(
    {

        uid: {
            type: String,
            required: false,
            description: txt_Uid_Description,
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
    Logger.db(`Created category ${doc.id}`);
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