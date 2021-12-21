import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import QuotesController from "./Quotes.controller";

export default class QuotesRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/quotes`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            QuotesController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin,
            QuotesController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            QuotesController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            QuotesController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            QuotesController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            QuotesController.removeById
        ]);
    }

}