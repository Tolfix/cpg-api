import { Application } from "express";
import { HomeDir } from "../Config";

export default function Swagger(server: Application)
{
    const expressSwagger = require('express-swagger-generator')();
    const swaggerUi = require("swagger-ui-express");

    let options = {
        swaggerDefinition: {
            info: {
                description: 'This is a sample server',
                title: 'Swagger',
                version: '1.0.0',
            },
            // host: 'localhost:8080',
            // basePath: '/v1',
            produces: [
                "application/json",
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
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
        files: [`${HomeDir}/build/Routes/**/*.js`] //Path to the API handle folder
    };
    let a = expressSwagger(options)
    server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(a));
}