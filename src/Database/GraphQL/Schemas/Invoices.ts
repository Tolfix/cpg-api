import { composeWithMongoose } from "graphql-compose-mongoose";
import invoiceModel from "../../Models/Invoices";

const InvoicesGraphQL = composeWithMongoose(invoiceModel);
export const startsWith = "Invoices";
export const InvoicesQuery = {
    invoiceById: InvoicesGraphQL.getResolver("findById"),
    invoiceByIds: InvoicesGraphQL.getResolver("findByIds"),
    invoiceOne: InvoicesGraphQL.getResolver("findOne"),
    invoiceMany: InvoicesGraphQL.getResolver("findMany"),
    invoiceCount: InvoicesGraphQL.getResolver("count"),
    invoiceConnection: InvoicesGraphQL.getResolver("connection"),
    invoicePagination: InvoicesGraphQL.getResolver("pagination"),
}

export const InvoicesMutation = {
    invoiceCreateOne: InvoicesGraphQL.getResolver("createOne"),
    invoiceCreateMany: InvoicesGraphQL.getResolver("createMany"),
    invoiceUpdateById: InvoicesGraphQL.getResolver("updateById"),
    invoiceUpdateOne: InvoicesGraphQL.getResolver("updateOne"),
    invoiceUpdateMany: InvoicesGraphQL.getResolver("updateMany"),
    invoiceRemoveById: InvoicesGraphQL.getResolver("removeById"),
    invoiceRemoveOne: InvoicesGraphQL.getResolver("removeOne"),
    invoiceRemoveMany: InvoicesGraphQL.getResolver("removeMany"),
};