  
import { model, Schema } from "mongoose"
import { IDIAdministrator } from "../../Interfaces/Administrators";

const AdminSchema = new Schema
(
    {

        uid: {
            type: String,
            required: true,
        },

        username: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

    }
);

const AdminModel = model<IDIAdministrator>("admin", AdminSchema);

export default AdminModel;