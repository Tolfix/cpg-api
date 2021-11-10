import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import ProductController from "./Products.controller";

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
            ProductController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin,
            ProductController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            ProductController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            ProductController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            ProductController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            ProductController.removeById
        ]);

    }

}