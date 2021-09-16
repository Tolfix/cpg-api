import { CacheAdmin } from "../Cache/CacheAdmin"
import { CacheCategories } from "../Cache/CacheCategories"
import { CacheCustomer } from "../Cache/CacheCustomer"

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
    let lastUid = parseInt(arrayC[arrayC.length-1].uid);
    let uid = lastUid+1;
    return uid;
}

export function idAdmin()
{
    let arrayC = CacheAdmin.array();
    let lastUid = parseInt(arrayC[arrayC.length-1].uid);
    let uid = lastUid+1;
    return uid;
}