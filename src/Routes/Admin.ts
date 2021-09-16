import { Application, Router } from "express";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

export default class AdminRouter
{
    private server: Application;
    private router = Router();
    public name = "Admin";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/admin", this.router);

        this.router.get("/isAuth", EnsureAdmin, (req, res) => {
            APISuccess("Authenticated")(res);
        });

    }
}