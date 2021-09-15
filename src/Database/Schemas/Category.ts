  
import { model, Schema } from "mongoose"
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

const CategoryModel = model<IDCategory>("category", CategorySchema);

export default CategoryModel;