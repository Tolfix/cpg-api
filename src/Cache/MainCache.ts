import { ce_orders } from "../Lib/Orders/PlaceOrder";
import { CacheAdmin } from "./CacheAdmin";
import { CacheCustomer } from "./CacheCustomer";
import { CacheInvoice } from "./CacheInvoices";
import { CacheOrder } from "./CacheOrder";
import { CacheProduct } from "./CacheProduct";
import { CacheTransactions } from "./CacheTransactions";

// Here contains the object of every cache
export default {
    Admin: CacheAdmin,
    Customer: CacheCustomer,
    Product: CacheProduct,
    Transaction: CacheTransactions,
    Order: CacheOrder,
    Invoice: CacheInvoice,
    f_orders: ce_orders
}