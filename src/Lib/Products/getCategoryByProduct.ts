import CategoryModel from "../../Database/Models/Category.model";
import { IProduct } from "@interface/Products.interface";

export default async (product: IProduct) =>
{
    return CategoryModel.findOne({ id: product.category_uid });
}