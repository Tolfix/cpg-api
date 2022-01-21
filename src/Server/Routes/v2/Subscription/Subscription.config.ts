import { Application, Router } from "express";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import SubscriptionController from "./Subscription.controller";

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