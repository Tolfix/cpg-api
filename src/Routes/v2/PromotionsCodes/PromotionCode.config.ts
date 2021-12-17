import { Application, Router } from "express";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import PromotionCodeController from "./PromotionCode.controller";

export default class PromotionCodeRoute
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/promotion_codes`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            PromotionCodeController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin,
            PromotionCodeController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            PromotionCodeController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            PromotionCodeController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            PromotionCodeController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            PromotionCodeController.removeById
        ]);
    }

}