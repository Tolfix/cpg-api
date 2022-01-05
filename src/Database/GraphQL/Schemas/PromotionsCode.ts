import { resolverAdminAccess } from "../ResolverAccess";
import { composeWithMongoose } from "graphql-compose-mongoose";
import PromotionsCodeModel from "../../Models/PromotionsCode";

const PromotionCodeGraphQL = composeWithMongoose(PromotionsCodeModel);
export const startsWith = "PromotionCode";
export const PromotionCodeQuery = {
    ...resolverAdminAccess({
        promotionCodeById: PromotionCodeGraphQL.getResolver("findById"),
        promotionCodeByIds: PromotionCodeGraphQL.getResolver("findByIds"),
        promotionCodeOne: PromotionCodeGraphQL.getResolver("findOne"),
        promotionCodeMany: PromotionCodeGraphQL.getResolver("findMany"),
        promotionCodeCount: PromotionCodeGraphQL.getResolver("count"),
        promotionCodeConnection: PromotionCodeGraphQL.getResolver("connection"),
        promotionCodePagination: PromotionCodeGraphQL.getResolver("pagination"),
    })
}

export const PromotionCodeMutation = {
    ...resolverAdminAccess({
        promotionCodeCreateOne: PromotionCodeGraphQL.getResolver("createOne"),
        promotionCodeCreateMany: PromotionCodeGraphQL.getResolver("createMany"),
        promotionCodeUpdateById: PromotionCodeGraphQL.getResolver("updateById"),
        promotionCodeUpdateOne: PromotionCodeGraphQL.getResolver("updateOne"),
        promotionCodeUpdateMany: PromotionCodeGraphQL.getResolver("updateMany"),
        promotionCodeRemoveById: PromotionCodeGraphQL.getResolver("removeById"),
        promotionCodeRemoveOne: PromotionCodeGraphQL.getResolver("removeOne"),
        promotionCodeRemoveMany: PromotionCodeGraphQL.getResolver("removeMany"),
    })
};