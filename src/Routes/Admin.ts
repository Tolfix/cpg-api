import { Application, Router } from "express";
import { JWT_Access_Token } from "../Config";
import jwt from "jsonwebtoken";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

export default class AdminRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/admin", this.router);
        /**
         * Checks if admins credentials are valid
         * @route GET /admin/validate
         * @group Admin - Admin routes
         * @security JWT
         */
        this.router.get("/validate", EnsureAdmin, (req, res) => {
            APISuccess("Authenticated", 202)(res);
        });

        /**
         * Validates admin Basic credentials and returns token.
         * @route POST /admin/auth
         * @group Admin - Admin routes
         * @returns {Object} 200 - Response with token
         * @returns {APIError} 404 - Failed
         * @security Basic
         */
        this.router.post("/auth", EnsureAdmin, (req, res) => {
            let token = jwt.sign({
                data: 'admin',
                exp: Math.floor(Date.now() / 1000) + ((60 * 60)*24)*7
            }, JWT_Access_Token);
            return APISuccess({
                text: "Succesfully created admin token",
                expires: "7 days",
                token: token,
            })(res);
        });

    }
}