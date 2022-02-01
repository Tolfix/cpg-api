import { IProduct } from "@ts/interfaces";
import CategoryModel from "../../Database/Models/Category.model";

export default async (product: IProduct) =>
{
    return await CategoryModel.findOne({ id: product.category_uid });
}