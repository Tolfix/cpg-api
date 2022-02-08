import { Application, Router } from "express";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import CategoryController from "./Categories.controller";

export = class CategoryRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/categories`, this.router);

        this.router.get("/", [
            CategoryController.list
        ]);

        this.router.get("/:uid", [
            CategoryController.getByUid
        ]);

        this.router.get("/:uid/products", [
            CategoryController.getProductsByUid
        ]);

        this.router.post("/", [
            EnsureAdmin(),
            CategoryController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin(),
            CategoryController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin(),
            CategoryController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin(),
            CategoryController.removeById
        ]);
    }

}