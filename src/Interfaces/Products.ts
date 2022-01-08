import { TRecurringMethod } from "../Types/PaymentMethod";
import { TPaymentTypes } from "../Types/PaymentTypes";
import { ICategory } from "./Categories";
import { IImage } from "./Images";

/**
 * @typedef Product
 * @property {string} product_name - Name of product.
 * @property {string} description - description for product.
 * @property {boolean} hidden - Is hidden.
 * @property {string} payment_type - Payment type can be the following : "free" | "one_time" | "recurring".
 * @property {number} price - Price of product.
 * @property {string} recurring_method - Method of payment if recurring, then can be the following : "monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially"
 * @property {number} setup_fee - Setup fee.
 * @property {boolean} special - If a special product or not.
 * @property {number} stock - Stock number.
 * @property {boolean} BStock - Should stock be enabled.
 * @property {Array.<string>} images - Images uid.
 */
export interface IProduct
{
    id: number;
    uid: `PROD_${string}`;
    name: string;
    description: string;
    category_uid: ICategory["uid"];
    stock: number;
    BStock: boolean;
    hidden: boolean;
    special: boolean;
    payment_type: Partial<TPaymentTypes>;
    price: number;
    setup_fee: number;
    image?: IImage["id"][];
    tax_rate: number;
    recurring_method?: Partial<TRecurringMethod>;
    module_name: string;
    modules: Array<IModules>;
}

export interface IModules
{
    name: string;
    value: string;
}

