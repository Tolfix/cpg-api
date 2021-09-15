import { CacheCategories } from "../Cache/CacheCategories"
import { CacheCustomer } from "../Cache/CacheCustomer"

export function idCustomer()
{
    return CacheCustomer.array().length+1
}

export function idCategory()
{
    return CacheCategories.array().length+1
}