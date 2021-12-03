import { model, Schema } from "mongoose"

const PasswordResetSchema = new Schema
(
    {

        token: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        used: {
            type: Boolean,
            default: false,
        }

    }
);

const PasswordResetModel = model("password_reset", PasswordResetSchema);

export default PasswordResetModel;