import { Resolver } from "graphql-compose";

export function resolverAdminAccess(resolvers: {
    [key: string]: Resolver<any, any, any, any>;
})
{
    Object.keys(resolvers).forEach((k) => {
      resolvers[k] = resolvers[k].wrapResolve(next => async rp => {

        if(!rp.context.isAuth)
            throw new Error("Not Authorized");

        if(!rp.context.isAdmin)
            throw new Error("Not Authorized");
  
        return next(rp)
      })
    })
    return resolvers
}

export function resolverUserAccess(resolvers: {
    [key: string]: Resolver<any, any, any, any>;
})
{
    Object.keys(resolvers).forEach((k) => {
      resolvers[k] = resolvers[k].wrapResolve(next => async rp => {
  
        if(!rp.context.isAuth)
            throw new Error("Not Authorized");

        if(rp.context.isAdmin)
            // return doc;
            return next(rp)

        if(!rp.context.isUser)
            throw new Error("Not Authorized");
  
        return next(rp)
      })
    })
    return resolvers
}