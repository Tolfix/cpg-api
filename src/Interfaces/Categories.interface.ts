import { IImage } from "./Images.interface";

export interface ICategory
{
    id: number;
    uid: `CAT_${string}`;
    name: string;
    description: string;
    images?: IImage["id"][];
    private: boolean;
}