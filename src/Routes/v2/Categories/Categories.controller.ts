import { Request, Response } from "express";
import CategoryModel from "../../../Database/Schemas/Category";
import ProductModel from "../../../Database/Schemas/Products";
import { ICategory } from "../../../Interfaces/Categories";
import { idCategory } from "../../../Lib/Generator";
import { APISuccess } from "../../../Lib/Response";
import BaseModelAPI from "../../../Models/BaseModelAPI";

const API_CategoryModel = new BaseModelAPI<ICategory>(idCategory, CategoryModel);

function insert(req: Request, res: Response)
{
    API_CategoryModel.create(req.body)
        .then((result) => {
            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API_CategoryModel.findByUid((req.params.uid as ICategory["uid"])).then((result) => {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    let limit = parseInt(req.query._end as string)
    && parseInt(req.query._end as string) <= 100 ? 
                                                parseInt(req.query._end as string) 
                                                :
                                                25;
    let start = 0;
    if(req.query)
        if(req.query._start)
            start = Number.isInteger(parseInt(req.query._start as string)) ? parseInt(req.query._start as string) : 0;

    API_CategoryModel.findAll(limit, start).then((result: any) => {
        APISuccess(result)(res)
    })
}

function patch(req: Request, res: Response)
{
    API_CategoryModel.findAndPatch((req.params.uid as ICategory["uid"]), req.body).then((result) => {
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API_CategoryModel.removeByUid(req.params.userId as ICategory["uid"])
        .then((result)=>{
            APISuccess({}, 204)(res)
        });
};

function getProductsByUid(req: Request, res: Response)
{
    ProductModel.find({ 
        category_uid: req.params.uid as ICategory["uid"]
    }).then((result) => {
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