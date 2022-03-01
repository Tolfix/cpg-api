import { Application, Router } from "express";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import OrderModel from "../../../../Database/Models/Orders.model";
import ProductModel from "../../../../Database/Models/Products.model";
import { IPayments } from "../../../../Interfaces/Payments.interface";
import { IProduct } from "../../../../Interfaces/Products.interface";
import { APIError, APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import OrderController from "./Orders.controller";
import dateFormat from "date-and-time";
import nextRecycleDate from "../../../../Lib/Dates/DateCycle";
import { createInvoiceFromOrder } from "../../../../Lib/Orders/newInvoice";
import { idOrder } from "../../../../Lib/Generator";
import { Company_Name } from "../../../../Config";
import { sendInvoiceEmail } from "../../../../Lib/Invoices/SendEmail";
import EnsureAuth from "../../../../Middlewares/EnsureAuth";
import { IOrder } from "../../../../Interfaces/Orders.interface";
import { ICustomer } from "../../../../Interfaces/Customer.interface";
import { SendEmail } from "../../../../Email/Send";
import NewOrderCreated from "../../../../Email/Templates/Orders/NewOrderCreated";
import { IConfigurableOptions } from "../../../../Interfaces/ConfigurableOptions.interface";
import mainEvent from "../../../../Events/Main.event";
import PromotionCodeModel from "../../../../Database/Models/PromotionsCode.model";
import Logger from "../../../../Lib/Logger";
import { ce_orders } from "../../../../Lib/Orders/PlaceOrder";
import { TRecurringMethod } from "../../../../Types/PaymentMethod";
import { TPaymentTypes } from "../../../../Types/PaymentTypes";
import { sanitizeMongoose } from "../../../../Lib/Sanitize";

async function createOrder(customer: ICustomer, products: Array<{
    product_id: IProduct["id"],
    quantity: number,
    configurable_options?: Array<{
        id: IConfigurableOptions["id"],
        option_index?: number,
    }>;
}>, _products: IProduct[], payment_method: string, billing_type: string, billing_cycle?: TRecurringMethod)
{
    const order = await (new OrderModel({
        customer_uid: customer.id,
        // @ts-ignore
        products: products.map(product =>
        {
            return {
                product_id: product.product_id,
                configurable_options: product?.configurable_options,
                quantity: product.quantity,
            }
        }),
        payment_method: payment_method as keyof IPayments,
        order_status: "active",
        billing_type: billing_type as TPaymentTypes,
        billing_cycle: billing_cycle,
        dates: {
            createdAt: new Date(),
            next_recycle: dateFormat.format(nextRecycleDate(
                new Date(), billing_cycle ?? "monthly")
            , "YYYY-MM-DD"),
            last_recycle: dateFormat.format(new Date(), "YYYY-MM-DD")
        },
        uid: idOrder(),
    }).save());

    mainEvent.emit("order_created", order);

    SendEmail(customer.personal.email, `New order from ${await Company_Name() !== "" ? await Company_Name() : "CPG"} #${order.id}`, {
        isHTML: true,
        body: await NewOrderCreated(order, customer), 
    });
}

export = class OrderRoute
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/orders`, this.router);

        this.router.get("/", [
            EnsureAdmin(),
            OrderController.list
        ]);

        this.router.post("/place", EnsureAuth(), async (req, res, next) =>
        {
            // @ts-ignore
            const customer_id = req.customer.id;
            const products = req.body.products as Array<{
                product_id: IProduct["id"],
                quantity: number,
                configurable_options?: Array<{
                    id: IConfigurableOptions["id"],
                    option_index: number,
                }>;
            }>;
            const payment_method = req.body.payment_method as keyof IPayments;
            const __promotion_code = req.body.promotion_code;
            const promotion_code = await PromotionCodeModel.findOne({
                name: sanitizeMongoose(__promotion_code),
            });
            // @ts-ignore
            Logger.info(`Order placed by ${req.customer.email}`, `General information:`, products, payment_method, promotion_code);

            if(!customer_id || !products || !payment_method)
                return APIError("Missing in body")(res);

            if(!payment_method.match(/manual|bank|paypal|credit_card|swish/g))
                return APIError("payment_method invalid")(res);

            if(products.every(e => e.quantity <= 0))
                return APIError("quantity invalid")(res);

            if(products.every(e => typeof e.product_id === "undefined"))
                return APIError("product_id invalid")(res);      

            // Check if customer_id is valid
            const customer = await CustomerModel.findOne({ id: customer_id });

            if(!customer)
                return APIError("Unable to find customer")(res);

            let _products = await ProductModel.find({
                id: {
                    $in: products.map(product => product.product_id)
                }
            });

            // Filter products which are hidden
            _products = _products.filter(product => product.hidden === false);

            if(_products.length <= 0)
                return APIError("No valid products ids")(res);

            const _order_ = <IOrder>{
                id: "",
                customer_uid: customer.id,
                // @ts-ignore
                products: [],
                payment_method: payment_method,
                order_status: "active",
                billing_type: "recurring",
                billing_cycle: "monthly",
                quantity: 1,
                dates: {
                    createdAt: new Date(),
                    next_recycle: dateFormat.format(nextRecycleDate(
                        new Date(), "monthly")
                    , "YYYY-MM-DD"),
                    last_recycle: dateFormat.format(new Date(), "YYYY-MM-DD")
                },
                uid: idOrder(),
                // @ts-ignore
                invoices: [],
                promotion_code: promotion_code?.id,
            }

            const one_timers = [];
            const recurring_monthly = [];
            const recurring_quarterly = [];
            const recurring_semi_annually = [];
            const recurring_biennially = [];
            const recurring_triennially = [];
            const recurring_yearly = [];

            // Possible to get a Dos attack
            // ! prevent this
            for (const p of _products)
            {
                if(p.payment_type === "one_time")
                    one_timers.push(p);

                if(p.payment_type === "recurring" && p.recurring_method === "monthly")
                    recurring_monthly.push(p);

                if(p.payment_type === "recurring" && p.recurring_method === "quarterly")
                    recurring_quarterly.push(p);

                if(p.payment_type === "recurring" && p.recurring_method === "semi_annually")
                    recurring_semi_annually.push(p);

                if(p.payment_type === "recurring" && p.recurring_method === "biennially")
                    recurring_biennially.push(p);
                
                if(p.payment_type === "recurring" && p.recurring_method === "triennially")
                    recurring_triennially.push(p);

                if(p.payment_type === "recurring" && p.recurring_method === "yearly")
                    recurring_yearly.push(p);

                let configurable_option: any = undefined
                if(products.find(e => e.product_id === p.id)?.configurable_options)
                    configurable_option = products.find(e => e.product_id === p.id)?.configurable_options

                _order_.products.push({
                    product_id: p.id,
                    // @ts-ignore
                    configurable_options: configurable_option,
                    quantity: products.find(p => p.product_id == p.product_id)?.quantity ?? 1
                });
            }

            // Create new orders
            if(recurring_monthly.length > 0)
                createOrder(customer, recurring_monthly.map(p =>
                {
                    return products.find(p2 => p2.product_id == p.id) ?? {
                        product_id: p.id,
                        quantity: 1
                    }
                }), recurring_monthly, payment_method, "recurring", "monthly");

            if(recurring_quarterly.length > 0)
                createOrder(customer, recurring_quarterly.map(p =>
                {
                    return products.find(p2 => p2.product_id == p.id) ?? {
                        product_id: p.id,
                        quantity: 1
                    }
                }), recurring_quarterly, payment_method, "recurring", "quarterly");

            if(recurring_semi_annually.length > 0)
                createOrder(customer, recurring_semi_annually.map(p =>
                {
                    return products.find(p2 => p2.product_id == p.id) ?? {
                        product_id: p.id,
                        quantity: 1
                    }
                }), recurring_semi_annually, payment_method, "recurring", "semi_annually");

            if(recurring_biennially.length > 0)
                createOrder(customer, recurring_biennially.map(p =>
                {
                    return products.find(p2 => p2.product_id == p.id) ?? {
                        product_id: p.id,
                        quantity: 1
                    }
                }), recurring_biennially, payment_method, "recurring", "biennially");

            if(recurring_triennially.length > 0)
                createOrder(customer, recurring_triennially.map(p =>
                {
                    return products.find(p2 => p2.product_id == p.id) ?? {
                        product_id: p.id,
                        quantity: 1
                    }
                }), recurring_triennially, payment_method, "recurring", "triennially");

            if(one_timers.length > 0)
                createOrder(customer, one_timers.map(p =>
                {
                    return products.find(p2 => p2.product_id == p.id) ?? {
                        product_id: p.id,
                        quantity: 1
                    }
                }), one_timers, payment_method, "one_time");

            if(recurring_yearly.length > 0)
                createOrder(customer, recurring_yearly.map(p =>
                {
                    return products.find(p2 => p2.product_id == p.id) ?? {
                        product_id: p.id,
                        quantity: 1
                    }
                }), recurring_yearly, payment_method, "recurring", "yearly");

            const invoice = await createInvoiceFromOrder(_order_);

            await sendInvoiceEmail(invoice, customer);

            if(!invoice)
                return APIError("Unable to create invoice, but created order.")(res);

            if(ce_orders.get(payment_method))
                return ce_orders.get(payment_method)?.(_order_, invoice, req, res, next);

            return APISuccess("Invoice sent")(res);
        });

        this.router.get("/:uid", [
            EnsureAdmin(),
            OrderController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin(),
            OrderController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin(),
            OrderController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin(),
            OrderController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin(),
            OrderController.removeById
        ]);

    }

}
