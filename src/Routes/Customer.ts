import { Application, Router } from "express";

export default class CustomerRouter
{
    private server: Application;
    private router = Router();

    public name = "Customer";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/customer", this.router);
    }
}