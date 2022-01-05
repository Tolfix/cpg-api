import ProductModel from "../../Database/Models/Products";

export default async (id: number) => {
    const product = await ProductModel.findOne({ id: id });
    if(!product)
        return null;
    return product;
};