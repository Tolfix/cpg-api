import { ApolloServer } from 'apollo-server-express';
import { JWT_Access_Token } from '../../Config';
import SchemaPoser from './SchemaPoser';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CacheAdmin, getAdminByUsername } from '../../Cache/CacheAdmin';

export default async (server: any) =>
{

    const apolloServer = new ApolloServer({
        schema: SchemaPoser,
        context: async ({ req, res }) => {
            
            const authHeader = req.headers['authorization'];
            if(!authHeader)
                return {
                    isAuth: false,
                }
        
            const b64auth = (authHeader).split(' ');
        
            if(!b64auth[0].toLocaleLowerCase().match(/basic|bearer/g))
                return {
                    isAuth: false,
                }
        
            if(!b64auth[1])
                return {
                    isAuth: false,
                }

            if(b64auth[0].toLocaleLowerCase() === "basic")
            {
                // Check if buffer, or base64
                let [login, password] = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString().split(':');
                if(login.includes("==") || password.includes("=="))
                {
                    login = atob(login);
                    password = login.split(":")[1];
                    login = login.split(":")[0];
                }
                
                // Check if admin
                if(CacheAdmin.has(getAdminByUsername(login) ?? "ADM_"))
                {
                    let succeed = await bcrypt.compare(password, (CacheAdmin.get(getAdminByUsername(login) ?? "ADM_")?.["password"] ?? ""));

                    if(!succeed)
                        return {
                            isAuth: false,
                        }
                }
            }

            if(b64auth[0].toLocaleLowerCase() === "bearer")
            {
                const token = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString();
                jwt.verify(token, JWT_Access_Token, (err, payload) => {
                    if(err || !payload)
                        return {
                            isAuth: false,
                        }


                    return {
                        isAuth: true,
                    }
                });
            }

            return {
                isAuth: false,
            }
        },
    });
    
    await apolloServer.start();

    apolloServer.applyMiddleware({
        app: server,
        path: "/graphql",
    });
}