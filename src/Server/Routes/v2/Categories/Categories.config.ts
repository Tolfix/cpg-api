import { Application, Router } from "express";
import CategoryModel from "../../../../Database/Models/Category.model";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import { APISuccess } from "../../../../Lib/Response";
import { setTypeValueOfObj } from "../../../../Lib/Sanitize";
import CategoryController from "./Categories.controller";

export = CategoryRouter; 
class CategoryRouter
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

        this.router.get("/json", (req, res) =>
        {
            const obj = Object.assign({}, CategoryModel.schema.obj);
            setTypeValueOfObj(obj);
            return APISuccess(obj)(res);
        });

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