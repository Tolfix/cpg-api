import mongoose from "mongoose";
import { reCache } from "../Cache/reCache";
import { DebugMode, Default_Language, MongoDB_URI } from "../Config";
import Logger from "../Lib/Logger";
import GetText from "../Translation/GetText";

mongoose.connect(MongoDB_URI);
const db = mongoose.connection;

db.on('error', (error: any) =>
{
    Logger.error(GetText(Default_Language).database.txt_Database_Error_default, error)
    // Logger.error(`A error occurred, in the database`, error);
});

db.on('disconnected', () =>
{
    Logger.error(GetText(Default_Language).database.txt_Database_Error_Lost_Connection);
    // Logger.error(`Lost connection to the database, shutting down.`);
    if (!DebugMode)
        process.exit(1);
});

db.once('open', () =>
{
    Logger.db(GetText(Default_Language).database.txt_Database_Opened);
    reCache();
    // Logger.db(`Database opened`);
});