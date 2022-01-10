import { Document } from "mongoose";
import { IImage } from "./Images.interface";

export interface ICategory
{
    uid: `CAT_${string}`;
    name: string;
    description: string;
    images?: IImage["id"][];
    private: boolean;
}

export interface IDCategory extends Document, ICategory {}