import { IConfigurableOptions } from "@ts/interfaces";
import { Request, Response } from "express";
import ConfigurableOptionsModel from "../../../../Database/Models/ConfigurableOptions.model";
import mainEvent from "../../../../Events/Main.event";
import { idConfigurableOptions } from "../../../../Lib/Generator";
import { APISuccess } from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";

const API = new BaseModelAPI<IConfigurableOptions>(idConfigurableOptions, ConfigurableOptionsModel);

function insert(req: Request, res: Response)
{
    API.create(req.body)
        .then((result) =>
        {

            mainEvent.emit("configurable_options_created", result);

            APISuccess({
                uid: result.uid
            })(res);
        });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as IConfigurableOptions["uid"])).then((result) =>
    {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    API.findAll(req.query, res).then((result: any) =>
    {
        APISuccess(result)(res)
    });
}

function patch(req: Request, res: Response)
{
    API.findAndPatch((req.params.uid as IConfigurableOptions["uid"]), req.body).then((result) =>
    {
        // @ts-ignore
        mainEvent.emit("configurable_options_updated", result);
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as IConfigurableOptions["uid"])
        .then((result)=>
        {
            // @ts-ignore
            mainEvent.emit("configurable_options_deleted", result);
            APISuccess(result, 204)(res)
        });
 }

const ConfigurableOptionsController = {
    insert,
    getByUid,
    list,
    patch,
    removeById
}

export default ConfigurableOptionsController;