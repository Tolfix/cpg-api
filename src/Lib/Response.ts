import { Response } from "express";
import Logger from "./Logger";

export function APISuccess(msg: any, status: number = 200)
{
    let response = {
        code: status,
        status: "Success",
        res: msg
    };
    Logger.debug(response);
    return (res: Response) => {
        res.status(status).json(response);
    }
}

export function APIError(msg: any, status: number = 400)
{
    let response = {
        code: status,
        status: "Error",
        res: msg
    };
    Logger.debug(response);
    return (res: Response) => {
        res.status(status).json(response);
    }
}