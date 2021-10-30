import { Response } from "express";
import Logger from "./Logger";

export function APISuccess(msg: any, status: number = 200)
{
    Logger.debug(msg);
    return (res: Response) => {
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count", msg?.length ?? 0)
        res.status(status).json(msg);
    }
}

export function APIError(msg: any, status: number = 400)
{
    Logger.debug(msg);
    return (res: Response) => {
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count", msg?.length ?? 0)
        res.status(status).json(msg);
    }
}