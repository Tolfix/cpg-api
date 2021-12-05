import mongoose,{ Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IImage } from "../../Interfaces/Images";

const ImageSchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        data: {
            type: Buffer,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            required: true,
        },

        size: {
            type: Number,
            required: true,
        },

    }
);

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

ImageSchema.plugin(increment.plugin, {
    model: 'images',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const ImageModel = model<IImage & Document>("images", ImageSchema);

export default ImageModel;