import { resolverAdminAccess } from "../ResolverAccess";
import { composeWithMongoose } from "graphql-compose-mongoose";
import ConfigurableOptionsModel from "../../Models/ConfigurableOptions.model";

export const ConfigurableOptionsGraphQL = composeWithMongoose(ConfigurableOptionsModel);
export const startsWith = "ConfigurableOptions";
export const ConfigurableOptionsQuery = {
    configurableOptionsById: ConfigurableOptionsGraphQL.getResolver("findById"),
    configurableOptionsByIds: ConfigurableOptionsGraphQL.getResolver("findByIds"),
    configurableOptionsOne: ConfigurableOptionsGraphQL.getResolver("findOne"),
    configurableOptionsMany: ConfigurableOptionsGraphQL.getResolver("findMany"),
    configurableOptionsCount: ConfigurableOptionsGraphQL.getResolver("count"),
    configurableOptionsConnection: ConfigurableOptionsGraphQL.getResolver("connection"),
    configurableOptionsPagination: ConfigurableOptionsGraphQL.getResolver("pagination"),
}

export const ConfigurableOptionsMutation = {
    ...resolverAdminAccess({
        configurableOptionsCreateOne: ConfigurableOptionsGraphQL.getResolver("createOne"),
        configurableOptionsCreateMany: ConfigurableOptionsGraphQL.getResolver("createMany"),
        configurableOptionsUpdateById: ConfigurableOptionsGraphQL.getResolver("updateById"),
        configurableOptionsUpdateOne: ConfigurableOptionsGraphQL.getResolver("updateOne"),
        configurableOptionsUpdateMany: ConfigurableOptionsGraphQL.getResolver("updateMany"),
        configurableOptionsRemoveById: ConfigurableOptionsGraphQL.getResolver("removeById"),
        configurableOptionsRemoveOne: ConfigurableOptionsGraphQL.getResolver("removeOne"),
        configurableOptionsRemoveMany: ConfigurableOptionsGraphQL.getResolver("removeMany"),
    })
};