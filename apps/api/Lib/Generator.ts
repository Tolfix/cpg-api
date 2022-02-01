import crypto from "crypto";
import { CacheAdmin } from "../Cache/Admin.cache";
import { CacheCategories } from "../Cache/Categories.cache";
import { CacheCustomer } from "../Cache/Customer.cache";
import { CacheImages } from "../Cache/Image.cache";
import { CacheInvoice } from "../Cache/Invoices.cache";
import { CacheOrder } from "../Cache/Order.cache";
import { CacheProduct } from "../Cache/Product.cache";
import { CacheTransactions } from "../Cache/Transactions.cache";
import { 
    IAdministrator, ICategory,
    IConfigurableOptions,
    ICustomer, IInvoice,
    IOrder, IProduct,
    ITransactions, IQuotes,
    ISubscription,
    IImage
} from "@ts/interfaces"

export function idCustomer(): ICustomer["uid"]
{
    let uid: ICustomer["uid"] = `CUS_${crypto.randomBytes(20).toString("hex")}`;
    while(CacheCustomer.get(uid))
        uid = `CUS_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idCategory(): ICategory["uid"]
{
    let uid: ICategory["uid"] = `CAT_${crypto.randomBytes(20).toString("hex")}`;
    while(CacheCategories.get(uid))
        uid = `CAT_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idProduct(): IProduct["uid"]
{
    let uid: IProduct["uid"] = `PROD_${crypto.randomBytes(20).toString("hex")}`;
    while(CacheProduct.get(uid))
        uid = `PROD_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idAdmin(): IAdministrator["uid"]
{
    let uid: IAdministrator["uid"] = `ADM_${crypto.randomBytes(20).toString("hex")}`;
    while(CacheAdmin.get(uid))
        uid = `ADM_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idOrder(): IOrder["uid"]
{
    let uid: IOrder["uid"] = `ORD_${crypto.randomBytes(20).toString("hex")}`;
    while(CacheOrder.get(uid))
        uid = `ORD_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idInvoice(): IInvoice["uid"]
{
    let uid: IInvoice["uid"] = `INV_${crypto.randomBytes(20).toString("hex")}`;
    while(CacheInvoice.get(uid))
        uid = `INV_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idTransicitons(): ITransactions["uid"]
{
    let uid: ITransactions["uid"] = `TRAN_${crypto.randomBytes(20).toString("hex")}`;
    while(CacheTransactions.get(uid))
        uid = `TRAN_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idImages(): IImage["uid"]
{
    let uid: IImage["uid"] = `IMG_${crypto.randomBytes(20).toString("hex")}`;
    while(CacheImages.get(uid))
        uid = `IMG_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idConfigurableOptions(): IConfigurableOptions["uid"]
{
    const uid: IConfigurableOptions["uid"] = `CO_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idQuotes(): IQuotes["uid"]
{
    const uid: IQuotes["uid"] = `QUO_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idSubscription(): ISubscription["uid"]
{
    const uid: ISubscription["uid"] = `SUB_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}