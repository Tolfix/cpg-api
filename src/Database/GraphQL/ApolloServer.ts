import { ApolloServer } from 'apollo-server-express';
import { Full_Domain, JWT_Access_Token } from '../../Config';
import SchemaPoser from './SchemaPoser';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CacheAdmin, getAdminByUsername } from '../../Cache/Admin.cache';
import Logger from '../../Lib/Logger';
import { Application } from "express";
import GetText from '../../Translation/GetText';

export default async (server: Application) =>
{

    const apolloServer = new ApolloServer({
        schema: SchemaPoser,
        context: async ({ req }) =>
        {
            
            const authHeader = req.headers['authorization'];
            if (!authHeader)
                return {
                    isAuth: false,
                }
        
            const b64auth = (authHeader).split(' ');
        
            if (!b64auth[0].toLocaleLowerCase().match(/basic|bearer/g))
                return {
                    isAuth: false,
                }
        
            if (!b64auth[1])
                return {
                    isAuth: false,
                }

            if (b64auth[0].toLocaleLowerCase() === "basic")
            {
                // Check if buffer, or base64
                let [login, password] = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString().split(':');
                if (login.includes("==") || password.includes("=="))
                {
                    //login = atob(login);
                    login = Buffer.from(login, 'base64').toString();
                    password = login.split(":")[1];
                    login = login.split(":")[0];
                }

                // Check if admin
                if (CacheAdmin.has(getAdminByUsername(login) ?? "ADM_"))
                {
                    const succeed = await bcrypt.compare(password, (CacheAdmin.get(getAdminByUsername(login) ?? "ADM_")?.["password"] ?? ""));

                    if (succeed)
                        return {
                            isAuth: true,
                            isAdmin: true,
                            isUser: false,
                            userData: null,
                        }
                }
            }

            if (b64auth[0].toLocaleLowerCase() === "bearer")
            {
                const token = (Buffer.isBuffer(b64auth[1]) ? Buffer.from(b64auth[1], 'base64') : b64auth[1]).toString();
                const suc = jwt.verify(token, JWT_Access_Token)
                // @ts-ignore
                if (suc?.data === "admin")
                    return {
                        isAuth: true,
                        isAdmin: true,
                        isUser: false,
                        userData: null,
                    }
                console.log(suc)
                // @ts-ignore
                if (suc?.data?.["id"])
                    return {
                        isAuth: true,
                        isAdmin: false,
                        isUser: true,
                        // @ts-ignore
                        userData: suc?.data,
                    }
            }

            return {
                isAuth: false,
                isAdmin: false,
                isUser: false,
                userData: null,
            }
        },
    });
    
    await apolloServer.start();
    Logger.graphql(`${GetText().graphql.txt_Apollo_Starting} ${Full_Domain}/graphql`);

    apolloServer.applyMiddleware({
        app: server,
        path: "/graphql",
    });
}