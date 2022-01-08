import { resolverAdminAccess, resolverUserAccess } from "../ResolverAccess";
import { composeWithMongoose } from "graphql-compose-mongoose";
import CustomerModel from "../../Models/Customers/Customer";
import { myInvoiceResolver, myInvoicesResolver, myOrderResolver, myOrdersResolver, myProfileResolver, myTransactionResolver, myTransactionsResolver } from "../Resolvers/Customer/Customer.resolver";
import { InvoicesGraphQL } from "./Invoices";
import { OrderGraphQL } from "./Order";
import { TransactionGraphQL } from "./Transactions";

export const CustomersGraphQL = composeWithMongoose(CustomerModel);
export const startsWith = "Customers";
export const CustomersQuery = {
    ...resolverUserAccess({
        myProfile: myProfileResolver(CustomersGraphQL),
        myInvoices: myInvoicesResolver(InvoicesGraphQL),
        myInvoice: myInvoiceResolver(InvoicesGraphQL),
        myOrders: myOrdersResolver(OrderGraphQL),
        myOrder: myOrderResolver(OrderGraphQL),
        myTransactions: myTransactionsResolver(TransactionGraphQL),
        myTransaction: myTransactionResolver(TransactionGraphQL),
    }),
    ...resolverAdminAccess({
        customerById: CustomersGraphQL.getResolver("findById"),
        customerByIds: CustomersGraphQL.getResolver("findByIds"),
        customerOne: CustomersGraphQL.getResolver("findOne"),
        customerMany: CustomersGraphQL.getResolver("findMany"),
        customerCount: CustomersGraphQL.getResolver("count"),
        customerConnection: CustomersGraphQL.getResolver("connection"),
        customerPagination: CustomersGraphQL.getResolver("pagination"),
    })
}

export const CustomersMutation = {
    customerCreateOne: CustomersGraphQL.getResolver("createOne"),
    ...resolverAdminAccess({
        customerCreateMany: CustomersGraphQL.getResolver("createMany"),
        customerUpdateById: CustomersGraphQL.getResolver("updateById"),
        customerUpdateOne: CustomersGraphQL.getResolver("updateOne"),
        customerUpdateMany: CustomersGraphQL.getResolver("updateMany"),
        customerRemoveById: CustomersGraphQL.getResolver("removeById"),
        customerRemoveOne: CustomersGraphQL.getResolver("removeOne"),
        customerRemoveMany: CustomersGraphQL.getResolver("removeMany"),
    })
};