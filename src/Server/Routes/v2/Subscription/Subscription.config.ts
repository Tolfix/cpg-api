import { Application, Router } from "express";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import ProductModel from "../../../../Database/Models/Products.model";
import PromotionCodeModel from "../../../../Database/Models/PromotionsCode.model";
import SubscriptionModel from "../../../../Database/Models/Subscriptions.model";
import { IConfigurableOptions } from "../../../../Interfaces/ConfigurableOptions.interface";
import { IPayments } from "../../../../Interfaces/Payments.interface";
import { IProduct } from "../../../../Interfaces/Products.interface";
import { idSubscription } from "../../../../Lib/Generator";
import { APIError, APISuccess } from "../../../../Lib/Response";
import { sanitizeMongoose } from "../../../../Lib/Sanitize";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import EnsureAuth from "../../../../Middlewares/EnsureAuth";
import SubscriptionController from "./Subscription.controller";
import dateFormat from "date-and-time";
import { ce_subscription } from "../../../../Lib/Subscriptions/PlaceSubscription";

export = class SubscriptionRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/subscriptions`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            SubscriptionController.list
        ]);

        this.router.post("/place-order", EnsureAuth(), async (req, res, next) =>
        {
            return APIError("Not implemented")(res);
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

            if(!customer_id || !products || !payment_method)
                return APIError("Missing in body")(res);

            if(!payment_method.match(/paypal|credit_card/g))
                return APIError("payment_method invalid")(res);

            if(products.every(e => e.quantity <= 0))
                return APIError("quantity invalid")(res);

            if(products.every(e => typeof e.product_id === "undefined"))
                return APIError("product_id invalid")(res);

            // Check if customer_id is valid
            const customer = await CustomerModel.findOne({ id: customer_id });

            if(!customer)
                return APIError("Unable to find customer")(res);

            const _products = await ProductModel.find({
                id: {
                    $in: products.map(product => product.product_id)
                }
            });

            // Remove products that doesn't have recurring in payment_type
            const products_with_recurring = _products.filter(product => product.payment_type.includes("recurring"));

            // Check if empty array
            if(products_with_recurring.length <= 0)
                return APIError(`Ensure that the products includes products with recurring payment type`)(res);

            // Check if they are all the same when it comes to recurring_method
            const p_same_method = products_with_recurring.every(product => product.recurring_method === products_with_recurring[0].recurring_method);

            if(!p_same_method)
                return APIError(`Ensure that products includes same recurring method`)(res);

            // Create subscription
            const subscription = await(new SubscriptionModel(
                {
                    customer_id: customer?.id,
                    products: products_with_recurring.map(product =>
                    {
                        let configurable_option: any = undefined
                        if(products.find(e => e.product_id === product.id)?.configurable_options)
                            configurable_option = products.find(e => e.product_id === product.id)?.configurable_options;
                        return {
                            product_id: product.id,
                            configurable_options_ids: configurable_option,
                            quantity: products.find(p => p.product_id == p.product_id)?.quantity ?? 1
                        }
                    }),
                    uid: idSubscription(),
                    start_date: dateFormat.format(new Date(), "yyyy-mm-dd"),
                    renewing_method: products_with_recurring[0].recurring_method,
                    payment_method: payment_method,
                    promotion_codes: promotion_code ? [promotion_code?.id] : [],
                    status: "active",
                    transactions: [],
                }
            )).save();

            if(!subscription)
                return APIError("Unable to create subscription")(res);

            if(ce_subscription.get(payment_method))
                return ce_subscription.get(payment_method)?.(subscription, req, res, next);

            return APISuccess("Invoice sent")(res);
        });

        this.router.get("/:uid", [
            EnsureAdmin,
            SubscriptionController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            SubscriptionController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            SubscriptionController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            SubscriptionController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            SubscriptionController.removeById
        ]);
    }

}