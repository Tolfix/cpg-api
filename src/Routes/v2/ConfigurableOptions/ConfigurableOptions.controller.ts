import { Request, Response } from "express";
import ConfigurableOptionsModel from "../../../Database/Schemas/ConfigurableOptions";
import { IConfigurableOptions } from "../../../Interfaces/ConfigurableOptions";
import { idConfigurableOptions } from "../../../Lib/Generator";
import { APISuccess } from "../../../Lib/Response";
import BaseModelAPI from "../../../Models/BaseModelAPI";

const API = new BaseModelAPI<IConfigurableOptions>(idConfigurableOptions, ConfigurableOptionsModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then((result) => {
            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as IConfigurableOptions["uid"])).then((result) => {
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

    let sort = req.query._sort as string ?? "id";
    let order = req.query._order as string ?? "asc";
        
    API.findAll(limit, start, sort, order).then((result: any) => {
        APISuccess(result)(res)
    });
}

function patch(req: Request, res: Response)
{
    API.findAndPatch((req.params.uid as IConfigurableOptions["uid"]), req.body).then((result) => {
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as IConfigurableOptions["uid"])
        .then((result)=>{
            APISuccess(result, 204)(res)
        });
 };

const ConfigurableOptionsController = {
    insert,
    getByUid,
    list,
    patch,
    removeById
}

export default ConfigurableOptionsController;