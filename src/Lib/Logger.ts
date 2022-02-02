import colors from "colors";
import fs from "fs";
import { DebugMode, HomeDir } from "../Config";
import mainEvent from "../Events/Main.event";
import { getDate, getTime } from "./Time";

// A method which takes a ...string[] and stores in a .txt file locally in ./logs/
export function SaveLog(date: string, ...args: string[])
{
    const file = `${HomeDir}/logs/${getDate(true)}.txt`;
    let data = date + " | " + args.join("\n");
    // Check if /logs/ exists
    if(!fs.existsSync(`${HomeDir}/logs/`))
        fs.mkdirSync(`${HomeDir}/logs/`);

    if(fs.existsSync(file))
        // Get file and add to data
        data = fs.readFileSync(file, "utf8") + "\n" + data;
    fs.writeFileSync(file, data);
}


const Logger = {
    trace: () =>
    {
        const err = new Error();
        const lines = err.stack?.split("\n");
        //@ts-ignore
        return lines[2].substring(lines[2].indexOf("("), lines[2].lastIndexOf(")") + 1)
    },

    debug: <T extends any[]> (...body: T) =>
    {
        if(DebugMode)
        {
            const time = getTime();
            SaveLog(time, ...body);
            mainEvent.emit("logging", {
                message: body.join(" "),
                type: "debug",
                time: time,
            });
            console.log(time + " | " + colors.cyan(`debug: `), ...body)
        }
    },

    api: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "api",
            time: time,
        });
        console.log(time + " | " + colors.green(`API: `), ...body)
    },

    graphql: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "graphql",
            time: time,
        });
        console.log(time + " | " + colors.magenta(`GraphQL: `), ...body)
    },


    plugin: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "plugin",
            time: time,
        });
        console.log(time + " | " + colors.green(`Plugin: `), ...body)
    },

    cache: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "cache",
            time: time,
        });
        console.log(time + " | " + colors.magenta(`cach`)+colors.yellow("e: "), ...body)
    },

    rainbow: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "rainbow",
            time: time,
        });
        console.log(time + " | " + colors.rainbow(`rainbow: `), ...body)
    },

    verbos: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "verbos",
            time: time,
        });
        console.log(time + " | " + colors.magenta(`verbos: `), ...body)
    },

    error: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "error",
            time: time,
        });
        console.log(time + " | ", colors.red(`error: `), ...body)
    },

    warning: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "warning",
            time: time,
        });
        console.log(time + " | ", colors.yellow(`warning: `), ...body)
    },

    info: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "info",
            time: time,
        });
        console.log(time + " | ", colors.blue(`info: `), ...body)
    },

    db: <T extends any[]> (...body: T) =>
    {
        const time = getTime();
        SaveLog(time, ...body);
        mainEvent.emit("logging", {
            message: body.join(" "),
            type: "db",
            time: time,
        });
        console.log(time + " | ", colors.cyan(`data`)+colors.green("base: "), ...body)
    },
}

export default Logger;