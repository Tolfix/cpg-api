import { Application, Router } from "express";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

export default class InvoiceRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/invoice", this.router);

    }
}