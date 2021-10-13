import AdminModel from "../Database/Schemas/Administrators";
import CategoryModel from "../Database/Schemas/Category";
import CustomerModel from "../Database/Schemas/Customer";
import ImageModel from "../Database/Schemas/Images";
import OrderModel from "../Database/Schemas/Orders";
import ProductModel from "../Database/Schemas/Products";
import TransactionsModel from "../Database/Schemas/Transactions";
import Logger from "../Lib/Logger";
import { CacheAdmin } from "./CacheAdmin";
import { CacheCategories } from "./CacheCategories";
import { CacheCustomer } from "./CacheCustomer";
import { CacheOrder } from "./CacheOrder";
import { CacheProduct } from "./CacheProduct";
import { CacheTransactions } from "./CacheTransactions";
import { CacheImages } from "./CacheImage";

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

export async function reCache()
{
    await reCache_Categories();
    await reCache_Admin();
    await reCache_Customers();
    await reCache_Product();
    await reCache_Transactions();
    await reCache_Orders();
    await reCache_Images();
}