import mongoose from "mongoose";
import { DebugMode, MongoDB_URI } from "../Config";
import Logger from "../Lib/Logger";
import increment from "mongoose-auto-increment";
import event from "events";

export default class Mongo_Database
{
    private db;

    constructor()
    {
        mongoose.connect(MongoDB_URI);
        this.db = mongoose.connection;

        this.db.on('error', (error: any) => {
            Logger.error(`A error accured for the database`, error);
        });
    
        this.db.on('disconnected', () => {
            Logger.error(`Lost connection to the database, shutting down.`);
            if(!DebugMode)
                process.exit(1);
        })
    
        this.db.once('open', () => {
            Logger.info(`Database opened`);
        });
    }
}