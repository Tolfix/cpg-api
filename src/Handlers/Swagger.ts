import { Application } from "express";
import { HomeDir } from "../Config";

export default function Swagger(server: Application, version: string)
{
    const expressSwagger = require('express-swagger-generator')();
    const swaggerUi = require("swagger-ui-express");

    const options = {
        swaggerDefinition: {
            info: {
                description: 'CPG API Swagger',
                title: 'CPG API',
                version: version,
            },
            produces: [
                "application/json",
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "Bearer",
                },
                Basic: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "Basic",
                }
            }
        },
        basedir: __dirname, //app absolute path
        files: [`${HomeDir}/build/Routes/${version}/**/*.js`, `${HomeDir}/build/Interfaces/**/*.js`] //Path to the API handle folder
    };
    const a = expressSwagger(options)
    server.use(`${version}/api-docs`, swaggerUi.serve, swaggerUi.setup(a));
}