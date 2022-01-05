import { composeWithMongoose } from "graphql-compose-mongoose";
import ProductsModel from "../../Models/Products";

const ProductsGraphQL = composeWithMongoose(ProductsModel);
export const startsWith = "Products";
export const ProductsQuery = {
    productById: ProductsGraphQL.getResolver("findById"),
    productByIds: ProductsGraphQL.getResolver("findByIds"),
    productOne: ProductsGraphQL.getResolver("findOne"),
    productMany: ProductsGraphQL.getResolver("findMany"),
    productCount: ProductsGraphQL.getResolver("count"),
    productConnection: ProductsGraphQL.getResolver("connection"),
    productPagination: ProductsGraphQL.getResolver("pagination"),
}

export const ProductsMutation = {
    productCreateOne: ProductsGraphQL.getResolver("createOne"),
    productCreateMany: ProductsGraphQL.getResolver("createMany"),
    productUpdateById: ProductsGraphQL.getResolver("updateById"),
    productUpdateOne: ProductsGraphQL.getResolver("updateOne"),
    productUpdateMany: ProductsGraphQL.getResolver("updateMany"),
    productRemoveById: ProductsGraphQL.getResolver("removeById"),
    productRemoveOne: ProductsGraphQL.getResolver("removeOne"),
    productRemoveMany: ProductsGraphQL.getResolver("removeMany"),
};