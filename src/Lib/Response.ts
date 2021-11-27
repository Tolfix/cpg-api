import { Response } from "express";

export function APISuccess(msg: any, status: number = 200)
{
    return (res: Response) => {
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count", msg?.length ?? 0)
        res.status(status).json(msg);
    }
}

export function APIError(msg: any, status: number = 400)
{
    return (res: Response) => {
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count", msg?.length ?? 0)
        res.status(status).json(msg);
    }
}