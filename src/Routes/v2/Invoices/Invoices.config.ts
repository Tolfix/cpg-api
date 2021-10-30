import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import InvoiceController from "./Invoices.controller";

export default class InvoiceRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/invoices`, this.router);

        this.router.get("/", [
            InvoiceController.list
        ]);

        this.router.get("/:uid", [
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