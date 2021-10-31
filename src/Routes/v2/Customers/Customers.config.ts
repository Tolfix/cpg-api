import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import CustomerController from "./Customers.controller";

export default class CustomerRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/customers`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            CustomerController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin,
            CustomerController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            CustomerController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            CustomerController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            CustomerController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            CustomerController.removeById
        ]);
    }

}