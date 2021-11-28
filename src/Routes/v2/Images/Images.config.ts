import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import ImageController from "./Images.controller";

export default class ProductsRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/images`, this.router);

        this.router.get("/", [
            ImageController.list
        ]);

        this.router.get("/:uid", [
            ImageController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            ImageController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            ImageController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            ImageController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            ImageController.removeById
        ]);

    }

}