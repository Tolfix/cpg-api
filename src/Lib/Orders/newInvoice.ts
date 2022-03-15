import InvoiceModel from "../../Database/Models/Invoices.model";
import ProductModel from "../../Database/Models/Products.model";
import { IInvoice_Dates } from "@interface/Invoice.interface";
import { IOrder } from "@interface/Orders.interface";
import { idInvoice } from "../Generator";
import dateFormat from "date-and-time";
import getCategoryByProduct from "../Products/getCategoryByProduct";
import { IProduct } from "@interface/Products.interface";
import ConfigurableOptionsModel from "../../Database/Models/ConfigurableOptions.model";
import { IConfigurableOptions } from "@interface/ConfigurableOptions.interface";
import mainEvent from "../../Events/Main.event";
import { IPromotionsCodes } from "@interface/PromotionsCodes.interface";
import { Document } from "mongoose";
import Logger from "../Logger";
import PromotionCodeModel from "../../Database/Models/PromotionsCode.model";
import { sanitizeMongoose } from "../Sanitize";
import CustomerModel from "../../Database/Models/Customers/Customer.model";
import { convertCurrency } from "../Currencies";

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
    let Products = await getProductsByOrder(order);
    const LBProducts = createMapProductsFromOrder(order);
    const Promotion_Code = await PromotionCodeModel.findOne({ id: sanitizeMongoose(order.promotion_code) });
    
    // Get customer id
    const Customer_Id = order.customer_uid;
    const customer = await CustomerModel.findOne({ $or: [
        { uid: Customer_Id },
        { id: Customer_Id },
    ] });
    if(!customer)
        throw new Error(`Customer ${Customer_Id} not found`);

    // Change products price based on customers.currenc
    Products = await Promise.all(Products.map(async product =>
    {
        // Check if same currency
        if(product.currency.toUpperCase() !== customer.currency.toUpperCase())
            // Convert to customer currency
            product.price = await convertCurrency(product.price, product.currency, customer.currency);
        return product;
    }));

    const items = [];
    for await(let product of Products)
    {
        if(Promotion_Code)
            // @ts-ignore
            product = await getNewPriceOfPromotionCode(Promotion_Code, product);
        const category = await getCategoryByProduct(product);
        items.push({
            amount: product.price,
            notes: `${category?.name} - ${product?.name}`,
            quantity: LBProducts.get(product.id)?.quantity ?? 1,
            product_id: product.id
        });
        if(LBProducts.get(product.id)?.configurable_options)
        {
            const configurable_options = await ConfigurableOptionsModel.find({
                id: {
                    // @ts-ignore
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    $in: [...LBProducts.get(product.id)?.configurable_options?.map(e => e.id ?? undefined)]
                }
            });
            if(configurable_options)
            {
                for await(const configurable_option of configurable_options)
                {
                    const option_index = LBProducts.get(product.id)?.configurable_options?.find(e => e.id === configurable_option.id)?.option_index ?? 0;
                    const option = configurable_option.options[
                        option_index
                    ];
                    // Fix option.price to customer currency
                    if(product.currency.toUpperCase() !== customer.currency.toUpperCase())
                        option.price = await convertCurrency(option.price, product.currency, customer.currency);

                    items.push({
                        amount: option.price ?? 0,
                        notes: `+ ${product?.name} - ${configurable_option.name} ${option.name}`,
                        quantity: 1,
                        configurable_options_id: configurable_option.id,
                        configurable_options_index: option_index
                    });
                }
            }
        }
    }

    // Create invoice
    const newInvoice = await (new InvoiceModel({
        uid: idInvoice(),
        customer_uid: Customer_Id,
        dates: <IInvoice_Dates>{
            due_date: order.dates.next_recycle,
            // Possible fix to issue #94
            invoice_date: order.dates.last_recycle,
            // invoice_date: dateFormat.format(new Date(), "YYYY-MM-DD"),
        },
        amount: items.reduce((acc, item) =>
        {
            return acc + item.amount * item.quantity;
        }, 0),
        items: items,
        payment_method: order.payment_method,
        status: order.order_status,
        tax_rate: Products?.reduce((acc, cur) => cur.tax_rate, 0),
        notes: "",
        currency: order.currency,
        paid: false,
        notified: false,
    })).save();

    mainEvent.emit("invoice_created", newInvoice);

    return newInvoice;
}

export async function getNewPriceOfPromotionCode(code: IPromotionsCodes & Document, product: IProduct)
{
    if(code.valid_to !== "permanent")
        // Convert string to date
        if(new Date(code.valid_to) < new Date())
        {
            Logger.debug(`Promotion code ${code.name} got invalid valid date`);
            return product;
        }

    if (code.uses <= 0)
    {
        Logger.warning(`Promotion code ${code.name} has no uses left`);
        return product;
    }

    Logger.info(`Promotion code ${code.name} (${code.id}) is valid`);

    // get product from code.products_ids[]
    // _products is also an array so we need to go through each product
    // Check if the product id is in the promotion code
    if(code.products_ids.includes(product.id))
    {
        Logger.info(`Promotion code ${code.name} (${code.id}) is valid for product ${product.id}`);
        const o_price = product.price;
        if(code.percentage)
            product.price = product.price-(product.price*code.discount);
        else
            product.price = product.price-code.discount;

        Logger.info(`New price of product ${product.id} is ${product.price}, old price was ${o_price}`);
        // Check if we are - on price
        if(product.price < 0)
        {
            Logger.error(`Product ${product.id} price is less than 0, making it "free" by setting it to 0`);
            product.price = 0;
        }
    }

    // Decrease the uses if not unlimited
    if(code.uses !== "unlimited")
        code.uses--;
    await code.save();

    return product;
}

export async function getPriceFromOrder(order: IOrder, product?: IProduct[])
{
    if(!product)
        product = await getProductsByOrder(order);
    
    return product.reduce((acc, cur) => acc + cur.price, 0);
}

export async function getProductsByOrder(order: IOrder)
{
    return ProductModel.find({
        id: {
            $in: [...order.products.map(product => product.product_id)]
        }
    });
}

export function createMapProductsFromOrder(order: IOrder)
{
    const a = new Map<IProduct["id"], {
        product_id: IProduct["id"],
        configurable_options?: Array<{
            id: IConfigurableOptions["id"],
            option_index: number;
        }>,
        quantity: number
    }>()
    order.products.forEach(product => a.set(product.product_id, product));
    return a;
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
