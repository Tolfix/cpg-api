import { Application, Router } from "express";
import { JWT_Access_Token } from "../../../../Config";
import jwt from "jsonwebtoken";
import { APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";

export = class AdminRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/admin`, this.router);
        /**
         * Checks if admins credentials are valid
         * @route GET /admin/validate
         * @group Admin - Admin routes
         * @security JWT
         */
        this.router.get("/validate", EnsureAdmin(), (req, res) =>
        {
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
        this.router.post("/auth", EnsureAdmin(), (req, res) =>
        {
            const token = jwt.sign({
                data: 'admin',
                // 7 days exp
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
            }, JWT_Access_Token);
            return APISuccess({
                text: "Successfully created admin token",
                expires: "7 days",
                token: token,
            })(res);
        });

    }
}