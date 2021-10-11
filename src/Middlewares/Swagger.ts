import { Application } from "express";
import { HomeDir } from "../Config";

export default function Swagger(server: Application)
{
    const expressSwagger = require('express-swagger-generator')();
    const swaggerUi = require("swagger-ui-express");

    let options = {
        swaggerDefinition: {
            info: {
                description: 'CPG API Swagger',
                title: 'CPG API',
                version: '0.0.1',
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
        files: [`${HomeDir}/build/Routes/**/*.js`, `${HomeDir}/build/Interfaces/**/*.js`] //Path to the API handle folder
    };
    let a = expressSwagger(options)
    server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(a));
}