import { Application, Router } from "express";
import CategoryController from "./Categories.controller";

export default class CategoryRouter
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

        this.router.post("/", [
            CategoryController.insert
        ]);

        this.router.patch("/uid", [
            CategoryController.patch
        ])

        this.router.delete("/:uid", [
            CategoryController.removeById
        ])
    }

}