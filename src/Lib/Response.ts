import { Response } from "express";
import Logger from "./Logger";

export function APISuccess(msg: any, status: number = 200)
{
    return (res: Response) => {
        let ip = res.req.headers['x-forwarded-for'] || res.req.socket.remoteAddress;
        let url = res.req.originalUrl;
        let method = res.req.method;
        Logger.api(`${ip} ${method} ${url} ${status}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count", msg?.length ?? 0)
        res.status(status).json(msg);
    }
}

export function APIError(msg: any, status: number = 400)
{
    return (res: Response) => {
        let ip = res.req.headers['x-forwarded-for'] || res.req.socket.remoteAddress;
        let url = res.req.originalUrl;
        let method = res.req.method;
        Logger.api(`${ip} ${method} ${url} ${status}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count", msg?.length ?? 0)
        res.status(status).json(msg);
    }
}