import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import TransactionsController from "./Transactions.controller";

export default class TransactionsRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/transactions`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            TransactionsController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin,
            TransactionsController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            TransactionsController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            TransactionsController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            TransactionsController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            TransactionsController.removeById
        ]);
    }

}