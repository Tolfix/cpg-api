import { Application, Router } from "express";

export default class CategoryRouter
{
    private server: Application;
    private router = Router();

    public name = "Category";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/category", this.router);
    }
}