import { Document } from "mongoose";

export interface IConfigs
{
    smtp: ISmtp;
    smtp_emails: Array<string>;
    webhooks_urls: Array<string>;
}

export interface IDConfigs extends IConfigs, Document {};

export interface ISmtp
{
    host: string;
    username: string;
    password: string;
    secure: Boolean;
    port: number;
}