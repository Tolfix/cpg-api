import { Document } from "mongoose";

export interface IImage
{
    uid: `IMG_${string}`;
    data: Buffer;
    type: string;
    size: number;
    name: string;
}

export interface IDImage extends IImage, Document {};