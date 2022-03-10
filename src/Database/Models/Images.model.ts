import mongoose,{ Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { Default_Language, MongoDB_URI } from "../../Config";
import { IImage } from "@interface/Images.interface";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";

const ImageSchema = new Schema
(
    {

        uid: {
            type: String,
            required: false,
            description: GetText(Default_Language).txt_Uid_Description,
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

// Log when creation
ImageSchema.post('save', function(doc: IImage & Document)
{
    Logger.db(GetText(Default_Language).database.txt_Model_Created(doc.modelName, doc.id));
    // Logger.db(`Created image ${doc.id}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

ImageSchema.plugin(increment.plugin, {
    model: 'images',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

const ImageModel = model<IImage & Document>("images", ImageSchema);

export default ImageModel;