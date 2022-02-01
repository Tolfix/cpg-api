import { Application, Router } from "express";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import ProductModel from "../../../../Database/Models/Products.model";
import PromotionCodeModel from "../../../../Database/Models/PromotionsCode.model";
import SubscriptionModel from "../../../../Database/Models/Subscriptions.model";
import { IConfigurableOptions, IPayments, IProduct } from "@ts/interfaces";
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
            EnsureAdmin(),
            SubscriptionController.list
        ]);

        this.router.post("/place-order", EnsureAuth(), async (req, res) =>
        {
            return APIError("Not implemented")(res);
        });

        this.router.get("/:uid", [
            EnsureAdmin(),
            SubscriptionController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin(),
            SubscriptionController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin(),
            SubscriptionController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin(),
            SubscriptionController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin(),
            SubscriptionController.removeById
        ]);
    }

}