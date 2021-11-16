import { Application, Router } from "express";

export default class StripeRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/stripe`, this.router);

        

    }

}