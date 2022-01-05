import { composeWithMongoose } from "graphql-compose-mongoose";
import CategoryModel from "../../Models/Category";

function adminAccess(resolvers) {
    Object.keys(resolvers).forEach((k) => {
      resolvers[k] = resolvers[k].wrapResolve(next => async rp => {
  
        // extend resolve params with hook
        rp.beforeRecordMutate = async function(doc, rp) { 
                if (!rp.context.isAuth) {
                    throw new Error("Not Authorized");
                }
                return doc;
            }
  
        return next(rp)
      })
    })
    return resolvers
}

const CategoriesGraphQL = composeWithMongoose(CategoryModel);
export const startsWith = "Categories";
export const CategoriesQuery = {
    categoryById: CategoriesGraphQL.mongooseResolver.findById(),
    categoryByIds: CategoriesGraphQL.getResolver("findByIds"),
    categoryOne: CategoriesGraphQL.getResolver("findOne"),
    categoryMany: CategoriesGraphQL.getResolver("findMany"),
    categoryCount: CategoriesGraphQL.getResolver("count"),
    categoryConnection: CategoriesGraphQL.getResolver("connection"),
    categoryPagination: CategoriesGraphQL.getResolver("pagination"),
}

export const CategoriesMutation = {
    adminAccess({
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