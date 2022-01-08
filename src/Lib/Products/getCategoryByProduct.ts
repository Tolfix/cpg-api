import CategoryModel from "../../Database/Models/Category.model";
import { IProduct } from "../../Interfaces/Products";

export default async (product: IProduct) =>
{
    return await CategoryModel.findOne({ id: product.category_uid });
}