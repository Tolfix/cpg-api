import mongoose from "mongoose";
import { DebugMode, MongoDB_URI } from "../Config";
import Logger from "../Lib/Logger";

mongoose.connect(MongoDB_URI);
const db = mongoose.connection;

db.on('error', (error: any) =>
{
    Logger.error(`A error accured for the database`, error);
});

db.on('disconnected', () =>
{
    Logger.error(`Lost connection to the database, shutting down.`);
    if(!DebugMode)
        process.exit(1);
})

db.once('open', () =>
{
    Logger.db(`Database opened`);
});