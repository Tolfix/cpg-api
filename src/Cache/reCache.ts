import AdminModel from "../Database/Models/Administrators.model";
import CategoryModel from "../Database/Models/Category.model";
import CustomerModel from "../Database/Models/Customers/Customer.model";
import ImageModel from "../Database/Models/Images.model";
import OrderModel from "../Database/Models/Orders.model";
import ProductModel from "../Database/Models/Products.model";
import TransactionsModel from "../Database/Models/Transactions.model";
import Logger from "../Lib/Logger";
import { CacheAdmin } from "./Admin.cache";
import { CacheCategories } from "./Categories.cache";
import { CacheCustomer } from "./Customer.cache";
import { CacheOrder } from "./Order.cache";
import { CacheProduct } from "./Product.cache";
import { CacheTransactions } from "./Transactions.cache";
import { CacheImages } from "./Image.cache";
import ConfigModel from "../Database/Models/Configs.model";
import { CacheConfig } from "./Configs.cache";
import InvoiceModel from "../Database/Models/Invoices.model";
import { CacheInvoice } from "./Invoices.cache";
import { Company_Currency } from "../Config";
import { TPaymentCurrency } from "../Lib/Currencies";

/**
 * @deprecated
 */
export function reCache_Categories()
{
    Logger.info(`Starting caching on categories..`);
    return new Promise(async (resolve) =>
    {
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
    return new Promise(async (resolve) =>
    {
        const admin = await AdminModel.find();
        for (const a of admin)
        {
            Logger.cache(`Caching admin ${a.uid}`);
            CacheAdmin.set(a.uid, a);
        }
        return resolve(true);
    });
}

export async function reCache_Customers()
{
    Logger.info(`Starting caching on customers..`);
    return new Promise(async (resolve) =>
    {
        const customer = await CustomerModel.find();
        for await (const c of customer)
        {
            // Check if customer has currency
            if (!c.currency)
            {
                const companyCurrency = await Company_Currency();
                c.currency = companyCurrency.toLocaleUpperCase() as TPaymentCurrency;
                await c.save();
            }
            Logger.cache(`Caching customer ${c.uid}`);
            CacheCustomer.set(c.uid, c);
        }
        return resolve(true);
    });
}

export async function reCache_Product()
{
    Logger.info(`Starting caching on products..`);
    return new Promise(async (resolve) =>
    {
        const product = await ProductModel.find();
        for (const c of product)
        {
            // Check if product has currency
            if (!c.currency)
            {
                const companyCurrency = await Company_Currency();
                c.currency = companyCurrency.toLocaleUpperCase() as TPaymentCurrency;
                await c.save();
            }
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
    return new Promise(async (resolve) =>
    {
        const transactions = await TransactionsModel.find();
        for (const t of transactions)
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
    return new Promise(async (resolve) =>
    {
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
    return new Promise(async (resolve) =>
    {
        const config = await ConfigModel.find();
        // Logger.debug(config);
        if (!config[0])
        {
            const smtpData = {
                smtp: {
                    host: "",
                    username: "",
                    password: "",
                    secure: false,
                    port: 25,
                },
                smtp_emails: [],
            }
            await new ConfigModel(smtpData).save();

            Logger.cache(`Caching config`);

            CacheConfig.set("smtp", smtpData.smtp);
            CacheConfig.set("smtp_emails", smtpData.smtp_emails);

            return resolve(true);
        }

        Logger.cache(`Caching config`);
        const c = config[0];

        // Check if c has payment_methods
        if (!c.payment_methods)
        {
            c.payment_methods = [];
            await c.save();
        }

        if (!c.extra)
        {
            c.extra = {};
            await c.save();
        }

        CacheConfig.set("smtp", c.smtp);
        CacheConfig.set("smtp_emails", c.smtp_emails);
        CacheConfig.set("payment_methods", c.payment_methods);
        CacheConfig.set("company", c.company);
        CacheConfig.set("webhooks_urls", c.webhooks_urls);
        CacheConfig.set("extra", c.extra);

        return resolve(true);
    });
}

export async function reCache_Images()
{
    Logger.info(`Starting caching on images..`);
    return new Promise(async (resolve) =>
    {
        const image = await ImageModel.find();
        for (const o of image)
        {
            Logger.cache(`Caching image ${o.id}`);
            CacheImages.set(o.id, o);
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
     return new Promise(async (resolve) =>
     {
         const invoice = await InvoiceModel.find();
         for await (const o of invoice)
         {
            // check if invoice has currency
            if (!o.currency)
            {
                const companyCurrency = await Company_Currency();
                o.currency = companyCurrency.toLocaleUpperCase() as TPaymentCurrency;
                await o.save();
            }
            Logger.cache(`Caching invoice ${o.uid}`);
            CacheInvoice.set(o.uid, o);
         }
         return resolve(true);
     });
 }

export async function reCache()
{
    await reCache_Configs();
    // await reCache_Categories();
    await reCache_Admin();
    await reCache_Customers();
    await reCache_Product();
    // await reCache_Transactions();
    // await reCache_Orders();
    await reCache_Images();
    await reCache_Invoices();
}