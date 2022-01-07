import { ObjectTypeComposer, ResolverResolveParams, Resolver, schemaComposer } from "graphql-compose";
import { ICustomer } from "../../../../Interfaces/Customer";
import CustomerModel from "../../../Models/Customers/Customer";

export function myProfileResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myProfile",
        type: object.getType(),
        args: {},
        resolve: async <TSource, TContext, TArgs>({
            source,
            args,
            context,
            info,
            projection,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        }, TArgs>) => {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            const data = await CustomerModel.findOne({
                id: context.userData.id,
            });

            return data;
        }
    })
};