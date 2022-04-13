import { Application, Router } from "express";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import OrderModel from "../../../../Database/Models/Orders.model";
import ProductModel from "../../../../Database/Models/Products.model";
import { IPayments } from "@interface/Payments.interface";
import { IProduct } from "@interface/Products.interface";
import { APIError, APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import OrderController from "./Orders.controller";
import dateFormat from "date-and-time";
import nextRecycleDate from "../../../../Lib/Dates/DateCycle";
import { createInvoiceFromOrder } from "../../../../Lib/Orders/newInvoice";
import { idOrder } from "../../../../Lib/Generator";
import { Company_Currency, Company_Name } from "../../../../Config";
import { sendInvoiceEmail } from "../../../../Lib/Invoices/SendEmail";
import EnsureAuth from "../../../../Middlewares/EnsureAuth";
import { IOrder } from "@interface/Orders.interface";
import { ICustomer } from "@interface/Customer.interface";
import { SendEmail } from "../../../../Email/Send";
import NewOrderCreated from "../../../../Email/Templates/Orders/NewOrderCreated";
import { IConfigurableOptions } from "@interface/ConfigurableOptions.interface";
import mainEvent from "../../../../Events/Main.event";
import PromotionCodeModel from "../../../../Database/Models/PromotionsCode.model";
import Logger from "../../../../Lib/Logger";
import { ce_orders } from "../../../../Lib/Orders/PlaceOrder";
import { TPayments, TRecurringMethod } from "../../../../Types/PaymentMethod";
import { TPaymentCurrency } from "../../../../Lib/Currencies";
import { TPaymentTypes } from "../../../../Types/PaymentTypes";
import { sanitizeMongoose } from "../../../../Lib/Sanitize";
import { getEnabledPaymentMethods } from "../../../../Cache/Configs.cache";
import { setTypeValueOfObj } from "../../../../Lib/Sanitize";

async function createOrder(payload: {
    customer: ICustomer,
    products: Array<{
        product_id: IProduct["id"],
        quantity: number,
        configurable_options?: Array<{
            id: IConfigurableOptions["id"],
            option_index?: number,
        }>;
    }>,
    _products: IProduct[],
    payment_method: keyof IPayments,
    billing_type: TPaymentTypes,
    billing_cycle?: TRecurringMethod,
    currency: TPaymentCurrency,
    fees: number,
})
{
    const order = await (new OrderModel({
        customer_uid: payload.customer.id,
        // @ts-ignore
        products: payload.products.map(product =>
        {
            return {
                product_id: product.product_id,
                configurable_options: product?.configurable_options,
                quantity: product.quantity,
            }
        }),
        payment_method: payload.payment_method as keyof IPayments,
        order_status: "active",
        billing_type: payload.billing_type as TPaymentTypes,
        billing_cycle: payload.billing_cycle,
        fees: payload.fees,
        dates: {
            createdAt: new Date(),
            next_recycle: dateFormat.format(nextRecycleDate(
                new Date(), payload.billing_cycle ?? "monthly")
            , "YYYY-MM-DD"),
            last_recycle: dateFormat.format(new Date(), "YYYY-MM-DD")
        },
        currency: payload.currency,
        uid: idOrder(),
    }).save());

    mainEvent.emit("order_created", order);

    await SendEmail(payload.customer.personal.email, `New order from ${await Company_Name() !== "" ? await Company_Name() : "CPG"} #${order.id}`, {
        isHTML: true,
        body: await NewOrderCreated(order, payload.customer),
    });
}
export = OrderRoute; 
class OrderRoute
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
            const payment_method = req.body.payment_method as TPayments;
            const fees = parseInt(req.body.fees ?? "0") as number ?? 0;
            // Check if payment_method is valid
            const validPaymentMethods = getEnabledPaymentMethods();
            
            if(!validPaymentMethods.includes(payment_method))
            {
                Logger.error(`Invalid payment method ${payment_method}`, `Please ensure you have enabled this payment method in the config (/v3/config/payment_methods)`);
                return APIError("Invalid payment method", 400)(res);
            }

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
                fees: fees,
                uid: idOrder(),
                // @ts-ignore
                invoices: [],
                currency: !customer.currency ? await Company_Currency() : customer.currency,
                promotion_code: promotion_code?.id,
            }

            const recurringMethods = {
                one_timers: <IProduct[]>[],
                monthly: <IProduct[]>[],
                yearly: <IProduct[]>[],
                quarterly: <IProduct[]>[],
                semi_annually: <IProduct[]>[],
                biennially: <IProduct[]>[],
                triennially: <IProduct[]>[],
            };

            // Possible to get a Dos attack
            // ! prevent this
            for (const p of _products)
            {
                if(p.payment_type === "one_time")
                    recurringMethods["one_timers"].push(p);

                if(p.payment_type === "recurring")
                {
                    switch(p.recurring_method)
                    {
                        case "monthly":
                            recurringMethods["monthly"].push(p);
                            break;
                        case "quarterly":
                            recurringMethods["quarterly"].push(p);
                            break;
                        case "semi_annually":
                            recurringMethods["semi_annually"].push(p);
                            break;
                        case "biennially":
                            recurringMethods["biennially"].push(p);
                            break;
                        case "triennially":
                            recurringMethods["triennially"].push(p);
                            break;
                        case "yearly":
                            recurringMethods["yearly"].push(p);
                            break;
                        default:
                            break;
                    }
                }

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

            // @ts-ignore
            Object.keys(recurringMethods).forEach(async (key: keyof (typeof recurringMethods)) =>
            {
                const isOneTimer = key === "one_timers";
                if(recurringMethods[key].length > 0)
                {
                    await createOrder({
                        customer: customer,
                        products: recurringMethods[key].map(p =>
                            {
                                return products.find(p2 => p2.product_id == p.id) ?? {
                                    product_id: p.id,
                                    quantity: 1
                                }
                        }),
                        payment_method: payment_method,
                        fees: fees,
                        currency: _order_.currency,
                        _products: recurringMethods[key],
                        billing_type: isOneTimer ? "one_time" : "recurring",
                        billing_cycle: !isOneTimer ? "monthly" : undefined,
                    })
                }
            });

            const invoice = await createInvoiceFromOrder(_order_);

            await sendInvoiceEmail(invoice, customer);

            if(!invoice)
                return APIError("Unable to create invoice, but created order.")(res);

            if(ce_orders.get(payment_method))
                return ce_orders.get(payment_method)?.(_order_, invoice, req, res, next);

            return APISuccess("Invoice sent")(res);
        });

        this.router.get("/json", (req, res) =>
        {
            const obj = Object.assign({}, OrderModel.schema.obj);
            setTypeValueOfObj(obj);
            return APISuccess(obj)(res);
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
