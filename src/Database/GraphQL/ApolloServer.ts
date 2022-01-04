import { ApolloServer } from 'apollo-server-express';
import SchemaPoser from './SchemaPoser';

export default async (server: any) =>
{

    const apolloServer = new ApolloServer({
        schema: SchemaPoser,
    });
    
    await apolloServer.start();

    apolloServer.applyMiddleware({
        app: server,
        path: "/v1/graphql",
    });
}