import { resolverAdminAccess } from "../ResolverAccess";
import { composeWithMongoose } from "graphql-compose-mongoose";
import CategoryModel from "../../Models/Category";

const CategoriesGraphQL = composeWithMongoose(CategoryModel);
export const startsWith = "Categories";
export const CategoriesQuery = {
    categoryById: CategoriesGraphQL.getResolver("findById"),
    categoryByIds: CategoriesGraphQL.getResolver("findByIds"),
    categoryOne: CategoriesGraphQL.getResolver("findOne"),
    categoryMany: CategoriesGraphQL.getResolver("findMany"),
    categoryCount: CategoriesGraphQL.getResolver("count"),
    categoryConnection: CategoriesGraphQL.getResolver("connection"),
    categoryPagination: CategoriesGraphQL.getResolver("pagination"),
}

export const CategoriesMutation = {
    ...resolverAdminAccess({
        categoryCreateOne: CategoriesGraphQL.getResolver("createOne"),
        categoryCreateMany: CategoriesGraphQL.getResolver("createMany"),
        categoryUpdateById: CategoriesGraphQL.getResolver("updateById"),
        categoryUpdateOne: CategoriesGraphQL.getResolver("updateOne"),
        categoryUpdateMany: CategoriesGraphQL.getResolver("updateMany"),
        categoryRemoveById: CategoriesGraphQL.getResolver("removeById"),
        categoryRemoveOne: CategoriesGraphQL.getResolver("removeOne"),
        categoryRemoveMany: CategoriesGraphQL.getResolver("removeMany"),
    })
};