import { Document } from "mongoose";

export interface IAdministrator
{
    uid: string;
    username: string;
    password: string;
    createdAt: Date;
}

export interface IDIAdministrator extends IAdministrator, Document {};