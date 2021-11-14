import ProductModel from "../../Database/Schemas/Products";

export default async (id: number) => {
    const product = await ProductModel.findOne({ id: id });
    if(!product)
        return null;
    return product;
};