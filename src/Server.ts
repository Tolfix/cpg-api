require("dotenv").config()
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import methodOverride from "method-override";
// import swaggerJsDoc, { Options as SwaggerOptions, SwaggerDefinition } from 'swagger-jsdoc';
// import swaggerUI, { SwaggerUiOptions } from 'swagger-ui-express';
import { HomeDir, MongoDB_URI, PORT } from "./Config";
import Logger from "./Lib/Logger";
import RouteHandler from "./Routes/Handler";

const server = express();

// mongoose.connect(MongoDB_URI);

server.use(cors({
    origin: true,
    credentials: true
}));

server.use(methodOverride('_method'));
server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader('X-Powered-By', 'Tolfix');
    next();
});

const sv = server.listen(PORT, () => Logger.info(`Server listing on port ${PORT}`));

RouteHandler(server);