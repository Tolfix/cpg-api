import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import CustomerController from "./Customers.controller";
import { JWT_Access_Token } from "../../../Config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { APIError, APISuccess } from "../../../Lib/Response";
import CustomerModel from "../../../Database/Schemas/Customer";
import Logger from "../../../Lib/Logger";
import EnsureAuth from "../../../Middlewares/EnsureAuth";

export default class CustomerRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/customers`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            CustomerController.list
        ]);

        this.router.get("/profile", [
            EnsureAuth,
            CustomerController.getMyProfile
        ]);

        this.router.get("/:uid", [
            EnsureAdmin,
            CustomerController.getByUid
        ]);

        this.router.post("/", [
            // EnsureAdmin,
            CustomerController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            CustomerController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            CustomerController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            CustomerController.removeById
        ]);

        this.router.post("/authenticate", async (req, res) => {
            
            const { username, password } = req.body;
            
            Logger.info(`Authenticating user ${username}`);

            if(!username || !password)
                return APIError("Please include username and password in body.")(res);
            
            const customer = await CustomerModel.findOne({ "personal.email": username });

            if(!customer)
                return APIError("Invalid email or password.")(res);

            // @ts-ignore
            const isCorrect = await bcrypt.compare(password, customer.password)

            if(!isCorrect)
                return APIError("Invalid email or password.")(res);

            let token = jwt.sign({
                data: {
                    id: customer.id,
                    email: customer.personal.email,
                },                
                exp: Math.floor(Date.now() / 1000) + (((60 * 60)*24))
            }, JWT_Access_Token);
            return APISuccess({
                text: "Succesfully created customer token",
                expires: "7 days",
                token: token,
            })(res);
        });

    }

}