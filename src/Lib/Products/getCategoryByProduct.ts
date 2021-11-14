import CategoryModel from "../../Database/Schemas/Category";
import { IProduct } from "../../Interfaces/Products";

export default async (product: IProduct) => {
    return await CategoryModel.findOne({ id: product.category_uid });
}