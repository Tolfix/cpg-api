import { Document, model, Schema } from "mongoose"
import Logger from "../../../Lib/Logger";

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

// Log when creation
PasswordResetSchema.post('save', function(doc: any)
{
    Logger.db(`Created password reset for ${doc.email}`);
});

export interface IPasswordReset
{
    token: string;
    email: string;
    used: boolean;
}

const PasswordResetModel = model<IPasswordReset & Document>("password_reset", PasswordResetSchema);

export default PasswordResetModel;