import Sequelize, {
    Model, Optional
} from "sequelize";
import { Billing, ICustomer, Personal } from "@interface/Customer.interface";
import { IImage } from "@interface/Images.interface";
import { postgres } from "../../../Postgres";
import { TPaymentCurrency } from "../../../../Lib/Currencies";

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
    declare currency: TPaymentCurrency;
    declare extra: {
        [key: string]: any;
    };
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

// @ts-ignore
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
    // // Fix this
    // personal: {
    //     references: {
    //         model: "personal",
    //         key: 
    //     },
    //     allowNull: false
    // },
    // // Fix this
    // billing: {
    //     type: Sequelize.JSON,
    //     allowNull: false
    // },
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

export class PersonalModel extends Model<Personal> implements Personal
{
    declare first_name: string;
    declare last_name: string;
    declare email: string;
    declare phone: string;
}

PersonalModel.init(
    {
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },

    },
    {
        sequelize: postgres,
        modelName: "personal"
    }
)

export class BillingModel extends Model<Billing> implements Billing
{
    declare company?: string;
    declare company_vat?: string;
    declare street01: string;
    declare street02?: string;
    declare city: string;
    declare state: string;
    declare postcode: string;
    declare country: string;
}

BillingModel.init(
    {
        company: {
            type: Sequelize.STRING,
            allowNull: true
        },
        company_vat: {
            type: Sequelize.STRING,
            allowNull: true
        },
        street01: {
            type: Sequelize.STRING,
            allowNull: false
        },
        street02: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        postcode: {
            type: Sequelize.STRING,
            allowNull: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },
    {
        sequelize: postgres,
        modelName: "billing"
    }
)

CustomerModel.hasOne(PersonalModel);
CustomerModel.hasOne(BillingModel);