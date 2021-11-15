import InvoiceModel from "../../Database/Schemas/Invoices";
import ProductModel from "../../Database/Schemas/Products";
import { IInvoice, IInvoices_Items, IInvoice_Dates } from "../../Interfaces/Invoice";
import { IOrder } from "../../Interfaces/Orders";
import { idInvoice } from "../Generator";
import dateFormat from "date-and-time";
import getCategoryByProduct from "../Products/getCategoryByProduct";


// Create a method that checks if the order next recycle is within 14 days
export function isWithinNext14Days(date: Date | string): boolean
{
    let nextRecycle;
    if(typeof date === "string")
        nextRecycle = dateFormat.parse(date, "YYYY-MM-DD");
    else
        nextRecycle = new Date(date);
    const today = new Date();
    const diff = Math.abs(nextRecycle.getTime() - today.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    return diffDays <= 14;
}

// Create a method that creates a invoice from IOrder interface
export async function createInvoiceFromOrder(order: IOrder)
{

    // Get our products
    const Products = await ProductModel.find({ id: {
        $in: [...order.products_uid]
    } });

    // Get customer id
    const Customer_Id = order.customer_uid;

    // Create invoice
    const newInvoice = await (new InvoiceModel({
        uid: idInvoice(),
        customer_uid: Customer_Id,
        dates: <IInvoice_Dates>{
            due_date: order.dates.next_recycle,
            invoice_date: dateFormat.format(new Date(), "YYYY-MM-DD"),
        },
        // Go through all products prices and add them together
        amount: Products.reduce((acc, cur) => acc + cur.price, 0),
        items: Products.map(async (product) => (<IInvoices_Items>{
            amount: product.price,
            notes: `${(await getCategoryByProduct(product))?.name} - ${product?.name}`,
            quantity: order.quantity,
        })),
        payment_method: order.payment_method,
        status: order.order_status,
        tax_rate: Products?.reduce((acc, cur) => cur.tax_rate, 0),
        notes: "",
        paid: false,
        notified: false,
    })).save();

    return newInvoice;
}

// Create a method that creates a new invoice for a customer
// It should get input from an order and decide if we should create a new invoice
// if the dates.next_recycle is in within the next 14 days
// Check also if order.billing_type is set to 'recurring'
// If so, we should create a new invoice
export function newInvoice(order: IOrder)
{
    if (order.billing_type === 'recurring' && isWithinNext14Days(order.dates.next_recycle ?? new Date()))
        return createInvoiceFromOrder(order);
    return null;
}
