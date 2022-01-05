import { composeWithMongoose } from "graphql-compose-mongoose";
import CustomerModel from "../../Models/Customers/Customer";

const CustomersGraphQL = composeWithMongoose(CustomerModel);
export const startsWith = "Customers";
export const CustomersQuery = {
    customerById: CustomersGraphQL.getResolver("findById"),
    customerByIds: CustomersGraphQL.getResolver("findByIds"),
    customerOne: CustomersGraphQL.getResolver("findOne"),
    customerMany: CustomersGraphQL.getResolver("findMany"),
    customerCount: CustomersGraphQL.getResolver("count"),
    customerConnection: CustomersGraphQL.getResolver("connection"),
    customerPagination: CustomersGraphQL.getResolver("pagination"),
}

export const CustomersMutation = {
    customerCreateOne: CustomersGraphQL.getResolver("createOne"),
    customerCreateMany: CustomersGraphQL.getResolver("createMany"),
    customerUpdateById: CustomersGraphQL.getResolver("updateById"),
    customerUpdateOne: CustomersGraphQL.getResolver("updateOne"),
    customerUpdateMany: CustomersGraphQL.getResolver("updateMany"),
    customerRemoveById: CustomersGraphQL.getResolver("removeById"),
    customerRemoveOne: CustomersGraphQL.getResolver("removeOne"),
    customerRemoveMany: CustomersGraphQL.getResolver("removeMany"),
};