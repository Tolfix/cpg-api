import { IProduct } from "@ts/interfaces";
import { Application, Router } from "express";
import ConfigurableOptionsModel from "../../../../Database/Models/ConfigurableOptions.model";
import ProductModel from "../../../../Database/Models/Products.model";
import AW from "../../../../Lib/AW";
import { APIError, APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import ProductController from "./Products.controller";

export = class ProductsRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/products`, this.router);

        this.router.get("/", [
            ProductController.list
        ]);

        this.router.get("/:uid", [
            ProductController.getByUid
        ]);

        this.router.get("/:uid/configurable_options", async (req, res) =>
        {
            const uid = req.params.uid;
            const [product, p_fail] = await AW(await ProductModel.findOne({ $or: [
                { uid: uid as IProduct["uid"] },
                { id: uid as unknown as any }
            ]}));
            if(p_fail || !product)
                return APIError("Failed to fetch product")(res);

            const [options, o_fail] = await AW(ConfigurableOptionsModel.find({
                products_ids: {
                    $in: [product.id]
                }
            }));

            if(o_fail)
                return APIError("Failed to fetch configurable options")(res);

            return APISuccess(options)(res);
        });

        this.router.post("/", [
            EnsureAdmin(),
            ProductController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin(),
            ProductController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin(),
            ProductController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin(),
            ProductController.removeById
        ]);

    }

}
