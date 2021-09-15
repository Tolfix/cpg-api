import { Application, Router } from "express";

export default class ProductRouter
{
    private server: Application;
    private router = Router();

    public name = "Product";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/product", this.router);
        
        this.router.get("/all", (req, res) => {

        })
    }
}