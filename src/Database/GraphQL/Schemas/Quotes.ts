import { resolverAdminAccess } from "../ResolverAccess";
import { composeWithMongoose } from "graphql-compose-mongoose";
import QuotesModel from "../../Models/Quotes";

export const QuotesGraphQL = composeWithMongoose(QuotesModel);
export const startsWith = "Quotes";
export const QuotesQuery = {
    ...resolverAdminAccess({
        quoteById: QuotesGraphQL.getResolver("findById"),
        quoteByIds: QuotesGraphQL.getResolver("findByIds"),
        quoteOne: QuotesGraphQL.getResolver("findOne"),
        quoteMany: QuotesGraphQL.getResolver("findMany"),
        quoteCount: QuotesGraphQL.getResolver("count"),
        quoteConnection: QuotesGraphQL.getResolver("connection"),
        quotePagination: QuotesGraphQL.getResolver("pagination"),
    })
}

export const QuotesMutation = {
    ...resolverAdminAccess({
        quoteCreateOne: QuotesGraphQL.getResolver("createOne"),
        quoteCreateMany: QuotesGraphQL.getResolver("createMany"),
        quoteUpdateById: QuotesGraphQL.getResolver("updateById"),
        quoteUpdateOne: QuotesGraphQL.getResolver("updateOne"),
        quoteUpdateMany: QuotesGraphQL.getResolver("updateMany"),
        quoteRemoveById: QuotesGraphQL.getResolver("removeById"),
        quoteRemoveOne: QuotesGraphQL.getResolver("removeOne"),
        quoteRemoveMany: QuotesGraphQL.getResolver("removeMany"),
    })
};