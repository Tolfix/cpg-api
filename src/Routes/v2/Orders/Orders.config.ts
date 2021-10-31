import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import OrderController from "./Orders.controller";

export default class OrderRoute
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/orders`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            OrderController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin,
            OrderController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            OrderController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            OrderController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            OrderController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            OrderController.removeById
        ]);

    }

}