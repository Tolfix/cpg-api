import { Document } from "mongoose";

export interface IAdministrator
{
    uid: `ADM_${string}`;
    username: string;
    password: string;
    createdAt: Date;
}

export interface IDIAdministrator extends IAdministrator, Document {};