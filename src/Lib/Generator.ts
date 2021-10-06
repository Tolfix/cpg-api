import crypto from "crypto";
import { CacheAdmin } from "../Cache/CacheAdmin";
import { CacheCategories } from "../Cache/CacheCategories";
import { CacheCustomer } from "../Cache/CacheCustomer";
import { CacheInvoice } from "../Cache/CacheInvoices";
import { CacheOrder } from "../Cache/CacheOrder";
import { CacheProduct } from "../Cache/CacheProduct";
import { IAdministrator } from "../Interfaces/Administrators";
import { ICategory } from "../Interfaces/Categories";
import { ICustomer } from "../Interfaces/Customer";
import { IInvoice } from "../Interfaces/Invoice";
import { IOrder } from "../Interfaces/Orders";
import { IProduct } from "../Interfaces/Products";
import { ITransactions } from "../Interfaces/Transactions";

/*
    Old method:
        let arrayC = Cache.array();
        let lastUid = parseInt(arrayC[arrayC.length-1]?.uid ?? "0");
        let uid = lastUid+1;
        return uid;
*/

export function idCustomer(): ICustomer["uid"]
{
    let uid: ICustomer["uid"] = `CUS_${crypto.randomBytes(20).toString("hex")}`;
    if(CacheCustomer.get(uid))
        uid = `CUS_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idCategory(): ICategory["uid"]
{
    let uid: ICategory["uid"] = `CAT_${crypto.randomBytes(20).toString("hex")}`;
    if(CacheCategories.get(uid))
        uid = `CAT_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idProduct(): IProduct["uid"]
{
    let uid: IProduct["uid"] = `PROD_${crypto.randomBytes(20).toString("hex")}`;
    if(CacheProduct.get(uid))
        uid = `PROD_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idAdmin(): IAdministrator["uid"]
{
    let uid: IAdministrator["uid"] = `ADM_${crypto.randomBytes(20).toString("hex")}`;
    if(CacheAdmin.get(uid))
        uid = `ADM_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idOrder(): IOrder["uid"]
{
    let uid: IOrder["uid"] = `ORD_${crypto.randomBytes(20).toString("hex")}`;
    if(CacheOrder.get(uid))
        uid = `ORD_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idInvoice(): IInvoice["uid"]
{
    let uid: IInvoice["uid"] = `INV_${crypto.randomBytes(20).toString("hex")}`;
    if(CacheInvoice.get(uid))
        uid = `INV_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}

export function idTransicitons(): ITransactions["uid"]
{
    let uid: ITransactions["uid"] = `TRAN_${crypto.randomBytes(20).toString("hex")}`;
    if(CacheInvoice.get(uid))
        uid = `TRAN_${crypto.randomBytes(20).toString("hex")}`;
    return uid;
}