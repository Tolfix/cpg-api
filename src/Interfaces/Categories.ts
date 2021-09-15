import { Document } from "mongoose";

export interface ICategory
{
    uid: string;
    name: string;
    description: string;
    private: Boolean;
}

export interface IDCategory extends Document, ICategory {};