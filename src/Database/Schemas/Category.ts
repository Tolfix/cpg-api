import mongoose, { model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IDCategory } from "../../Interfaces/Categories";

const CategorySchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        private: {
            type: Boolean,
            required: true,
        },

    }
);

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