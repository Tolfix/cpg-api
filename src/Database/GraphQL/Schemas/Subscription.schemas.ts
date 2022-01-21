import { resolverAdminAccess } from "../ResolverAccess";
import { composeWithMongoose } from "graphql-compose-mongoose";
import SubscriptionModel from "../../Models/Subscriptions.model";

export const SubscriptionGraphQL = composeWithMongoose(SubscriptionModel);
export const startsWith = "Subscription";
export const SubscriptionQuery = {
    ...resolverAdminAccess({
        subscriptionById: SubscriptionGraphQL.getResolver("findById"),
        subscriptionByIds: SubscriptionGraphQL.getResolver("findByIds"),
        subscriptionOne: SubscriptionGraphQL.getResolver("findOne"),
        subscriptionMany: SubscriptionGraphQL.getResolver("findMany"),
        subscriptionCount: SubscriptionGraphQL.getResolver("count"),
        subscriptionConnection: SubscriptionGraphQL.getResolver("connection"),
        subscriptionPagination: SubscriptionGraphQL.getResolver("pagination"),
    })
}

export const SubscriptionMutation = {
    ...resolverAdminAccess({
        subscriptionCreateOne: SubscriptionGraphQL.getResolver("createOne"),
        subscriptionCreateMany: SubscriptionGraphQL.getResolver("createMany"),
        subscriptionUpdateById: SubscriptionGraphQL.getResolver("updateById"),
        subscriptionUpdateOne: SubscriptionGraphQL.getResolver("updateOne"),
        subscriptionUpdateMany: SubscriptionGraphQL.getResolver("updateMany"),
        subscriptionRemoveById: SubscriptionGraphQL.getResolver("removeById"),
        subscriptionRemoveOne: SubscriptionGraphQL.getResolver("removeOne"),
        subscriptionRemoveMany: SubscriptionGraphQL.getResolver("removeMany"),
    })
};