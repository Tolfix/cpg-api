import { IPromotionsCodes } from "@ts/interfaces";
import { Request, Response } from "express";
import PromotionCodeModel from "../../../../Database/Models/PromotionsCode.model";
import { idCategory } from "../../../../Lib/Generator";
import { APISuccess } from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";

// @ts-ignore
const API = new BaseModelAPI<IPromotionsCodes>(idCategory, PromotionCodeModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then((result) =>
        {

            APISuccess({
                id: result.id
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid)).then((result) =>
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
    API.findAndPatch((req.params.uid), req.body).then((result) =>
    {
        // @ts-ignore
        // mainEvent.emit("categories_updated", result);
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid)
        .then(()=>
        {
            // @ts-ignore
            // mainEvent.emit("", result);
            APISuccess({}, 204)(res)
        });
}


const PromotionCodeController = {
    insert,
    getByUid,
    list,
    patch,
    removeById,
}

export default PromotionCodeController;
