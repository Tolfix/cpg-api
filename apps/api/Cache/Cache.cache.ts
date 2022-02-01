import { ce_orders } from "../Lib/Orders/PlaceOrder";
import { CacheAdmin } from "./Admin.cache";
import { CacheCustomer } from "./Customer.cache";
import { CacheInvoice } from "./Invoices.cache";
import { CacheOrder } from "./Order.cache";
import { CacheProduct } from "./Product.cache";
import { CacheTransactions } from "./Transactions.cache";

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