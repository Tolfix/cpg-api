import { Request, Response } from "express";
import CategoryModel from "../../../../Database/Models/Category.model";
import ProductModel from "../../../../Database/Models/Products.model";
import mainEvent from "../../../../Events/Main.event";
import { ICategory } from "../../../../Interfaces/Categories.interface";
import { idCategory } from "../../../../Lib/Generator";
import { APISuccess } from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";

const API = new BaseModelAPI<ICategory>(idCategory, CategoryModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then((result) =>
        {

            mainEvent.emit("categories_created", result);

            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as ICategory["uid"])).then((result) =>
    {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    API.findAll(req.query, res).then((result: any) =>
    {
        APISuccess(result)(res)
    })
}

function patch(req: Request, res: Response)
{
    API.findAndPatch((req.params.uid as ICategory["uid"]), req.body).then((result) =>
    {
        // @ts-ignore
        mainEvent.emit("categories_updated", result);
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as ICategory["uid"])
        .then((result)=>
        {
            // @ts-ignore
            mainEvent.emit("categories_deleted", result);
            APISuccess({}, 204)(res)
        });
}

function getProductsByUid(req: Request, res: Response)
{
    ProductModel.find({ 
        category_uid: req.params.uid as ICategory["uid"]
    }).then((result) =>
    {
      APISuccess(result)(res);  
    })
}

const CategoryController = {
    insert,
    getByUid,
    list,
    patch,
    removeById,
    getProductsByUid
}

export default CategoryController;
