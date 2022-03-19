import { Application, Router } from "express";
import ConfigurableOptionsModel from "../../../../Database/Models/ConfigurableOptions.model";
import { APISuccess } from "../../../../Lib/Response";
import { setTypeValueOfObj } from "../../../../Lib/Sanitize";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import ConfigurableOptionsController from "./ConfigurableOptions.controller";
export = ProductsRouter; 
class ProductsRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/configurable_options`, this.router);

        this.router.get("/", [
            ConfigurableOptionsController.list
        ]);

        this.router.get("/json", (req, res) =>
        {
            const obj = Object.assign({}, ConfigurableOptionsModel.schema.obj);
            setTypeValueOfObj(obj);
            return APISuccess(obj)(res);
        });

        this.router.get("/:uid", [
            ConfigurableOptionsController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin(),
            ConfigurableOptionsController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin(),
            ConfigurableOptionsController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin(),
            ConfigurableOptionsController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin(),
            ConfigurableOptionsController.removeById
        ]);

    }

}