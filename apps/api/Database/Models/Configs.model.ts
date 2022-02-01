import { IDConfigs } from "@ts/interfaces";
import { model, Schema } from "mongoose"

const ConfigsSchema = new Schema
(
    {

        smtp: {
            type: Object,
            default: {},
        },

        smtp_emails: {
            type: Array,
            default: [],
        },

        webhooks_urls: {
            type: Array,
            default: [],
        },

        company: {
            type: Object,
            default: {},
        }

    }
);

const ConfigModel = model<IDConfigs>("configs", ConfigsSchema);

export default ConfigModel;