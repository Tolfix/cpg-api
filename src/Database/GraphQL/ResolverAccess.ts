import { Resolver } from "graphql-compose";

export function resolverAdminAccess(resolvers: {
    [key: string]: Resolver<any, any, any, any>;
})
{
    Object.keys(resolvers).forEach((k) => {
      resolvers[k] = resolvers[k].wrapResolve(next => async rp => {
  
        // extend resolve params with hook
        rp.beforeRecordMutate = async function(doc: any, rp: { context: { 
            isAuth: boolean;
            isAdmin: boolean;
            isUser: boolean;
        }; }) {
                if(!rp.context.isAuth)
                {
                    throw new Error("Not Authorized");
                }

                if(!rp.context.isAdmin)
                {
                    throw new Error("Not Authorized");
                }

                return doc;
            }
  
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
  
        // extend resolve params with hook
        rp.beforeRecordMutate = async function(doc: any, rp: { context: { 
            isAuth: boolean;
            isAdmin: boolean;
            isUser: boolean;
        }; }) {
                if(!rp.context.isAuth)
                {
                    throw new Error("Not Authorized");
                }

                if(rp.context.isAdmin)
                {
                    return doc;
                }

                if(!rp.context.isUser)
                {
                    throw new Error("Not Authorized");
                }

                return doc;
            }
  
        return next(rp)
      })
    })
    return resolvers
}