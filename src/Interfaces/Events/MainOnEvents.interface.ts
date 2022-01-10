import { ICategory } from "../Categories.interface";
import { IConfigurableOptions } from "../ConfigurableOptions.interface";
import { ICustomer } from "../Customer.interface";
import { ILoggingTypes } from "../Logging.interface";
import { IImage } from "../Images.interface";
import { IInvoice } from "../Invoice.interface";
import { IOrder } from "../Orders.interface";
import { IProduct } from "../Products.interface";
import { IQuotes } from "../Quotes.interface";
import { ITransactions } from "../Transactions.interface";

export interface MainOnEvents
{
    invoice_created: IInvoice;
    invoice_deleted: IInvoice;
    invoice_updated: IInvoice;
    invoice_paid: IInvoice;
    invoice_notified: IInvoice;

    order_created: IOrder;
    order_updated: IOrder;
    order_deleted: IOrder;

    categories_created: ICategory;
    categories_updated: ICategory;
    categories_deleted: ICategory;

    product_created: IProduct;
    product_updated: IProduct;
    product_deleted: IProduct;

    customer_created: ICustomer;
    customer_updated: ICustomer;
    customer_deleted: ICustomer;

    images_created: IImage;
    images_updated: IImage;
    images_deleted: IImage;

    transaction_created: ITransactions;
    transaction_updated: ITransactions;
    transaction_deleted: ITransactions;

    configurable_options_created: IConfigurableOptions;
    configurable_options_updated: IConfigurableOptions;
    configurable_options_deleted: IConfigurableOptions;

    quotes_created: IQuotes;
    quotes_updated: IQuotes;
    quotes_deleted: IQuotes;

    logging: {
        message: string;
        type: keyof ILoggingTypes;
        time: string;
    }
}