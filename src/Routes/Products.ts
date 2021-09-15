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
        
        /**
         * @swagger
         * /books:
         *   get:
         *     description: Get all books
         *     responses:
         *       200:
         *         description: Success
         * 
         */
        this.router.get("/all", (req, res) => {

        })
    }
}