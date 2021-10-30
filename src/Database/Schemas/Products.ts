  
import mongoose, { model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IDProduct } from "../../Interfaces/Products";

const ProductSchema = new Schema
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
            default: '',
        },

        hidden: {
            type: Boolean,
            required: true,
        },

        category_uid: {
            type: String,
            required: true,
        },

        stock: {
            type: Number,
            required: true,
        },

        BStock: {
            type: Boolean,
            required: true,
        },

        special: {
            type: Boolean,
            required: true,
        },

        payment_type: {
            type: Object,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        setup_fee: {
            type: Number,
            required: true,
        },
        
        recurring_method: {
            type: Object,
            default: '',
        },

        image: {
            type: Object,
            // default: '',
        },

    }
);

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

ProductSchema.plugin(increment.plugin, {
    model: 'products',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const ProductModel = model<IDProduct>("products", ProductSchema);

export default ProductModel;