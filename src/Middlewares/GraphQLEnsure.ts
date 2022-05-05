import { skip } from 'graphql-resolvers';
export default (parent: any, args: any, { isAuth }: any) =>
{
    if (!isAuth)
        throw new Error("Not authenticated");

    skip;
};