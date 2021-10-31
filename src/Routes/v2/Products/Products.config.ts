import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import InvoiceController from "./Products.controller";

export default class ProductsRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/products`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            InvoiceController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin,
            InvoiceController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            InvoiceController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            InvoiceController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            InvoiceController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            InvoiceController.removeById
        ]);

    }

}