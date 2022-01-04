import AdminModel from "../Database/Models/Administrators";
import CategoryModel from "../Database/Models/Category";
import CustomerModel from "../Database/Models/Customers/Customer";
import ImageModel from "../Database/Models/Images";
import OrderModel from "../Database/Models/Orders";
import ProductModel from "../Database/Models/Products";
import TransactionsModel from "../Database/Models/Transactions";
import Logger from "../Lib/Logger";
import { CacheAdmin } from "./CacheAdmin";
import { CacheCategories } from "./CacheCategories";
import { CacheCustomer } from "./CacheCustomer";
import { CacheOrder } from "./CacheOrder";
import { CacheProduct } from "./CacheProduct";
import { CacheTransactions } from "./CacheTransactions";
import { CacheImages } from "./CacheImage";
import ConfigModel from "../Database/Models/Configs";
import { CacheConfig } from "./CacheConfigs";
import InvoiceModel from "../Database/Models/Invoices";
import { CacheInvoice } from "./CacheInvoices";

/**
 * @deprecated
 */
export function reCache_Categories()
{
    Logger.info(`Starting caching on categories..`);
    return new Promise(async (resolve, reject) => {
        const categories = await CategoryModel.find();
        for (const c of categories)
        {
            Logger.cache(`Caching category ${c.uid}`);
            CacheCategories.set(c.uid, c);
        }
        return resolve(true);
    });
}

export async function reCache_Admin()
{
    Logger.info(`Starting caching on admins..`);
    return new Promise(async (resolve, reject) => {
        const admin = await AdminModel.find();
        for (const a of admin)
        {
            Logger.cache(`Caching admin ${a.uid}`);
            CacheAdmin.set(a.uid, a);
        }
        return resolve(true);
    });
}

/**
 * @deprecated
 */
export async function reCache_Customers()
{
    Logger.info(`Starting caching on customers..`);
    return new Promise(async (resolve, reject) => {
        const customer = await CustomerModel.find();
        for (const c of customer)
        {
            Logger.cache(`Caching customer ${c.uid}`);
            CacheCustomer.set(c.uid, c);
        }
        return resolve(true);
    });
}

/**
 * @deprecated
 */
export async function reCache_Product()
{
    Logger.info(`Starting caching on products..`);
    return new Promise(async (resolve, reject) => {
        const product = await ProductModel.find();
        for (const c of product)
        {
            Logger.cache(`Caching product ${c.uid}`);
            CacheProduct.set(c.uid, c);
        }
        return resolve(true);
    });
}

/**
 * @deprecated
 */
export async function reCache_Transactions()
{
    Logger.info(`Starting caching on transactions..`);
    return new Promise(async (resolve, reject) => {
        const transa = await TransactionsModel.find();
        for (const t of transa)
        {
            Logger.cache(`Caching transaction ${t.uid}`);
            CacheTransactions.set(t.uid, t);
        }
        return resolve(true);
    });
}

/**
 * @deprecated
 */
export async function reCache_Orders()
{
    Logger.info(`Starting caching on orders..`);
    return new Promise(async (resolve, reject) => {
        const order = await OrderModel.find();
        for (const o of order)
        {
            Logger.cache(`Caching order ${o.uid}`);
            CacheOrder.set(o.uid, o);
        }
        return resolve(true);
    });
}

export async function reCache_Configs()
{
    Logger.info(`Starting caching on configs..`);
    return new Promise(async (resolve, reject) => {
        const config = await ConfigModel.find();
        // Logger.debug(config);
        if(!config[0])
        {
            let smtpData = {
                smtp: {
                    host: "",
                    username: "",
                    password: "",
                    secure: false,
                    port: 25,
                },
                smtp_emails: [],
            }
            new ConfigModel(smtpData).save();

            Logger.cache(`Caching config`);

            CacheConfig.set("smtp", smtpData.smtp);
            CacheConfig.set("smtp_emails", smtpData.smtp_emails);

            return resolve(true);
        }

        Logger.cache(`Caching config`);
        let c = config[0];

        CacheConfig.set("smtp", c.smtp);
        CacheConfig.set("smtp_emails", c.smtp_emails);

        return resolve(true);
    });
}

/**
 * @deprecated
 */
export async function reCache_Images()
{
    Logger.info(`Starting caching on images..`);
    return new Promise(async (resolve, reject) => {
        const image = await ImageModel.find();
        for (const o of image)
        {
            Logger.cache(`Caching image ${o.uid}`);
            CacheImages.set(o.uid, o);
        }
        return resolve(true);
    });
}


/**
 * @deprecated
 */
 export async function reCache_Invoices()
 {
     Logger.info(`Starting caching on invoices..`);
     return new Promise(async (resolve, reject) => {
         const invoice = await InvoiceModel.find();
         for (const o of invoice)
         {
             Logger.cache(`Caching invoice ${o.uid}`);
             CacheInvoice.set(o.uid, o);
         }
         return resolve(true);
     });
 }

/**
 * @deprecated
 */
export async function reCache()
{
    await reCache_Configs();
    await reCache_Categories();
    await reCache_Admin();
    await reCache_Customers();
    await reCache_Product();
    await reCache_Transactions();
    await reCache_Orders();
    await reCache_Images();
    await reCache_Invoices();
}