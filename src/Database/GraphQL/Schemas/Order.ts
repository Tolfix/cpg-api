import { composeWithMongoose } from "graphql-compose-mongoose";
import OrdersModel from "../../Models/Orders";

const OrderGraphQL = composeWithMongoose(OrdersModel);
export const startsWith = "Order";
export const OrderQuery = {
    ordersById: OrderGraphQL.getResolver("findById"),
    ordersByIds: OrderGraphQL.getResolver("findByIds"),
    ordersOne: OrderGraphQL.getResolver("findOne"),
    ordersMany: OrderGraphQL.getResolver("findMany"),
    ordersCount: OrderGraphQL.getResolver("count"),
    ordersConnection: OrderGraphQL.getResolver("connection"),
    ordersPagination: OrderGraphQL.getResolver("pagination"),
}

export const OrderMutation = {
    ordersCreateOne: OrderGraphQL.getResolver("createOne"),
    ordersCreateMany: OrderGraphQL.getResolver("createMany"),
    ordersUpdateById: OrderGraphQL.getResolver("updateById"),
    ordersUpdateOne: OrderGraphQL.getResolver("updateOne"),
    ordersUpdateMany: OrderGraphQL.getResolver("updateMany"),
    ordersRemoveById: OrderGraphQL.getResolver("removeById"),
    ordersRemoveOne: OrderGraphQL.getResolver("removeOne"),
    ordersRemoveMany: OrderGraphQL.getResolver("removeMany"),
};