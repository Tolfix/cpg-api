import Sequelize, {
    Model, Optional
} from "sequelize";
import { ICustomer } from "@interface/Customer.interface";
import { IImage } from "@interface/Images.interface";
import { postgres } from "../../../Postgres";

export class CustomerModel extends Model<ICustomer, Optional<ICustomer, "id">> implements ICustomer
{
    declare id: number;
    declare uid: ICustomer["uid"];
    declare personal: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
    };
    declare billing: {
        company?: string;
        company_vat?: string;
        street01: string;
        street02?: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
    declare password: string;
    declare profile_picture: IImage["id"] | null;
    declare extra: {
        [key: string]: any;
    };
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

CustomerModel.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    // Fix this
    personal: {
        type: Sequelize.JSON,
        allowNull: false
    },
    // Fix this
    billing: {
        type: Sequelize.JSON,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    profile_picture: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: "images",
            key: "id"
        }
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    extra: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    }
}, {
    sequelize: postgres,
    modelName: "customers"
});
