  
import { model, Schema } from "mongoose"
import { IDImage } from "../../Interfaces/Images";

const ImageSchame = new Schema
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

const ImageModel = model<IDImage>("images", ImageSchame);

export default ImageModel;