import { resolverAdminAccess } from "../ResolverAccess";
import { composeWithMongoose } from "graphql-compose-mongoose";
import TransactionsModel from "../../Models/Transactions";

export const TransactionGraphQL = composeWithMongoose(TransactionsModel);
export const startsWith = "Transaction";
export const TransactionQuery = {
    ...resolverAdminAccess({
        transactionById: TransactionGraphQL.getResolver("findById"),
        transactionByIds: TransactionGraphQL.getResolver("findByIds"),
        transactionOne: TransactionGraphQL.getResolver("findOne"),
        transactionMany: TransactionGraphQL.getResolver("findMany"),
        transactionCount: TransactionGraphQL.getResolver("count"),
        transactionConnection: TransactionGraphQL.getResolver("connection"),
        transactionPagination: TransactionGraphQL.getResolver("pagination"),
    })
}

export const TransactionMutation = {
    ...resolverAdminAccess({
        transactionCreateOne: TransactionGraphQL.getResolver("createOne"),
        transactionCreateMany: TransactionGraphQL.getResolver("createMany"),
        transactionUpdateById: TransactionGraphQL.getResolver("updateById"),
        transactionUpdateOne: TransactionGraphQL.getResolver("updateOne"),
        transactionUpdateMany: TransactionGraphQL.getResolver("updateMany"),
        transactionRemoveById: TransactionGraphQL.getResolver("removeById"),
        transactionRemoveOne: TransactionGraphQL.getResolver("removeOne"),
        transactionRemoveMany: TransactionGraphQL.getResolver("removeMany"),
    })
};