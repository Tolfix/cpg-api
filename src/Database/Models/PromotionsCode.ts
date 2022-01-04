import mongoose,{ Document, model, Schema } from "mongoose"
import increment from "mongoose-auto-increment";
import { MongoDB_URI } from "../../Config";
import { IPromotionsCodes } from "../../Interfaces/PromotionsCodes";
import Logger from "../../Lib/Logger";

const PromotionCodeSchema = new Schema
(
    {

        name: {
            type: String,
            required: true
        },

        discount: {
            type: Number,
            required: true,
        },

        valid_to: {
            type: String,
            default: "permament"
        },

        uses: {
            type: Number,
            default: "unlimited"
        },

        procentage: {
            type: Boolean,
            default: false
        },

        products_ids: {
            type: Array,
            required: true
        }

    }
);

// Log when creation
PromotionCodeSchema.post('save', function(doc: IPromotionsCodes & Document)
{
    Logger.db(`Created promotion code ${doc.name}`);
});

const connection = mongoose.createConnection(MongoDB_URI);
increment.initialize(connection);

PromotionCodeSchema.plugin(increment.plugin, {
    model: 'promotions_codes',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});

const PromotionCodeModel = model<IPromotionsCodes & Document>("promotions_codes", PromotionCodeSchema);

export default PromotionCodeModel;