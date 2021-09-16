import { Application, Router } from "express";
import { CacheCategories } from "../Cache/CacheCategories";
import CategoryModel from "../Database/Schemas/Category";
import AW from "../Lib/AW";
import { idCategory } from "../Lib/Generator";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

export default class CategoryRouter
{
    private server: Application;
    private router = Router();
    public name = "Category";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/category", this.router);

        this.router.get("/get/all", (req, res) => {
            APISuccess(CacheCategories.array())(res);
        });

        this.router.get("/get/:id", (req, res) => {
            const id = req.params.id;

            const category = CacheCategories.get(id);

            if(!category)
                return APIError({
                    text: `Unable to find category by id ${id}`
                })(res);

            APISuccess(category)(res);
        });

        this.router.post("/post/create", EnsureAdmin, (req, res) => {
            let { name, description, Private } = req.body;

            if(!name)
                return APIError({
                    text: "Missing 'name' in body"
                })(res);

            if(!description)
                return APIError({
                    text: "Missing 'description' in body"
                })(res);

            if(!Private)
                Private = false;

            let info = {
                name,
                description,
                private: Private,
                uid: idCategory().toString(),   
            }

            new CategoryModel(info).save();
            CacheCategories.set(info.uid, info);

            APISuccess({
                text: "Succesfully created category.",
                uid: info.uid,
            })(res);
        });

        this.router.delete("/delete/:uid", EnsureAdmin, async (req, res) => {
            const uid = req.params.uid;

            if(!CacheCategories.get(uid))
                return APIError({
                    text: "Ensure uid is correct",
                })(res);

            const [Success, Fail] = await AW(CategoryModel.deleteOne({ uid: uid }));
                
            if(Fail)
                return APIError({
                    text: "Something went wrong, try again later.",
                })(res);

            CacheCategories.delete(uid);
            APISuccess({
                text: "Succesfully deleted category",
                uid
            })(res)
        });
    }
}