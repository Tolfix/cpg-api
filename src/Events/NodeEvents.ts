import Logger from "../Lib/Logger";

export default function NodeEvents()
{
    process.on('exit', (code) => {
        Logger.error(`About to exit with code`, code);
    });

    process.on('unhandledRejection', (reason, promise) => {
        Logger.error('Unhandled Rejection at: ', promise, ' reason: ', reason);
    });

    process.on('uncaughtExceptionMonitor', (err: any, origin: any) => {
        Logger.error(`An error`, err, "at ", origin);
    });
}