import { CacheAdmin } from "../Cache/CacheAdmin"
import { CacheCategories } from "../Cache/CacheCategories"
import { CacheCustomer } from "../Cache/CacheCustomer"
import { CacheInvoice } from "../Cache/CacheInvoices";
import { CacheOrder } from "../Cache/CacheOrder";
import { CacheProduct } from "../Cache/CacheProduct";

export function idCustomer()
{
    let arrayC = CacheCustomer.array();
    let lastUid = parseInt(arrayC[arrayC.length-1].uid);
    let uid = lastUid+1;
    return uid;
}

export function idCategory()
{
    let arrayC = CacheCategories.array();
    let lastUid = parseInt(arrayC[arrayC.length-1]?.uid ?? "0");
    let uid = lastUid+1;
    return uid;
}

export function idProduct()
{
    let arrayC = CacheProduct.array();
    let lastUid = parseInt(arrayC[arrayC.length-1]?.uid ?? "0");
    let uid = lastUid+1;
    return uid;
}

export function idAdmin()
{
    let arrayC = CacheAdmin.array();
    let lastUid = parseInt(arrayC[arrayC.length-1]?.uid ?? "0");
    let uid = lastUid+1;
    return uid;
}

export function idOrder()
{
    let arrayC = CacheOrder.array();
    let lastUid = parseInt(arrayC[arrayC.length-1]?.uid ?? "0");
    let uid = lastUid+1;
    return uid;
}

export function idInvoice()
{
    let arrayC = CacheInvoice.array();
    let lastUid = parseInt(arrayC[arrayC.length-1]?.uid ?? "0");
    let uid = lastUid+1;
    return uid;
}

export function idTransicitons(): `TRAN_${string}`
{
    return `TRAN_${require("crypto").randomBytes(10).toString("hex")}`
}