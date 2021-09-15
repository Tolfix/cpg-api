import { Application, Router } from "express";
import { CacheCategories } from "../Cache/CacheCategories";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";

export default class CategoryRouter
{
    private server: Application;
    private router = Router();
    public name = "Category";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/category", this.router);

        this.router.get("/all", (req, res) => {
            APISuccess(CacheCategories.array())(res);
        });

        this.router.get("/:id", (req, res) => {
            const id = req.params.id;

            const category = CacheCategories.get(id);

            if(!category)
                return APIError({
                    text: `Unable to find category by id ${id}`
                })(res);

            APISuccess(category)(res);
        });
    }
}