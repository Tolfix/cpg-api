import AdminModel from "../Database/Schemas/Administrators";
import CategoryModel from "../Database/Schemas/Category";
import CustomerModel from "../Database/Schemas/Customer";
import ProductModel from "../Database/Schemas/Products";
import Logger from "../Lib/Logger";
import { CacheAdmin } from "./CacheAdmin";
import { CacheCategories } from "./CacheCategories";
import { CacheCustomer } from "./CacheCustomer";
import { CacheProduct } from "./CacheProduct";

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

export async function reCache()
{
    await reCache_Categories();
    await reCache_Admin();
    await reCache_Customers();
    await reCache_Product();
}