import { Resolver } from "graphql-compose";
import Logger from "../../Lib/Logger";
import GetText from "../../Translation/GetText";

export function resolverAdminAccess(resolvers: {
    [key: string]: Resolver;
})
{
    Object.keys(resolvers).forEach((k) =>
    {
        resolvers[k] = resolvers[k].wrapResolve(next => async rp =>
        {
            Logger.graphql(GetText().graphql.txt_Resolver_Checking_Admin(k));
            // Logger.graphql(`Checking if user is admin on ${k}`);

            if (!rp.context.isAuth)
                throw new Error("Not Authorized");

            if (!rp.context.isAdmin)
                throw new Error("Not Authorized");

            return next(rp);
        })
    })
    return resolvers
}

export function resolverUserAccess(resolvers: {
    [key: string]: Resolver;
})
{
    Object.keys(resolvers).forEach((k) =>
    {
        resolvers[k] = resolvers[k].wrapResolve(next => async rp =>
        {
    
            Logger.graphql(GetText().graphql.txt_Resolver_Checking_User(k));
            // Logger.graphql(`Checking if user is user on ${k}`);

            if (!rp.context.isAuth)
                throw new Error("Not Authorized");

            if (rp.context.isAdmin)
                // return doc;
                return next(rp)

            if (!rp.context.isUser)
                throw new Error("Not Authorized");
    
            return next(rp)
        })
    })
    return resolvers
}