import prompt from "prompt";
import { CacheAdmin } from "../Cache/CacheAdmin";
import ConfigModel from "../Database/Schemas/Configs";
import Logger from "../Lib/Logger";
import createAdmin from "./CreateAdmin";
import updateSMTP from "./updateSMTP";

export default class AdminHandler
{
    constructor()
    {
        prompt.start();
        this.action();
    }

    private action()
    {
        prompt.get(['action'], async (err, result) => {

            if(result.action === "help")
                Logger.info("Available actions: create, delete, show_admins, help, update_smtp");

            if(result.action === "create")
                await this.create();

            if(result.action === "show_admins")
                await this.show();

            if(result.action === "update_smtp")
                await this.update_smtp();

            this.action();
        });
    }

    private async update_smtp()
    {
        const config = (await ConfigModel.find())[0];
        return new Promise((resolve, reject) => {
            prompt.get([
                {
                    name: "host",
                    description: "Host for SMTP server",
                    default: config.smtp.host,
                    required: true
                },
                {
                    name: "port",
                    description: "Port",
                    default: config.smtp.port,
                    required: true
                },
                {
                    name: "username",
                    description: "Username for user",
                    default: config.smtp.username,
                    required: true
                },
                {
                    name: "password",
                    description: "Password for user",
                    default: config.smtp.password,
                    required: true
                },
                {
                    name: "secure",
                    description: "Is connection secure?",
                    default: config.smtp.secure,
                    enum: ["true", "false"],
                    required: true
                },
            ], async (err, result) => {
                const host = result.host as string;
                const port = parseInt(result.port as string) as number;
                const username = result.username as string;
                const password = result.password as string;
                const secure = result.secure === "true";

                Logger.info(`Updating smtp config..`);
                updateSMTP({
                    host,
                    port,
                    username,
                    password,
                    secure
                });
                resolve(true)
            });
        });
    }

    private async show()
    {
        Logger.info(CacheAdmin.array());
    }

    private async create()
    {
        return new Promise((resolve, reject) => {
            prompt.get([
                {
                    name: "username",
                    description: "Username for administrator",
                    required: true
                },
                {
                    name: "password",
                    description: "Password for administrator",
                    required: true
                },
            ], async (err, result) => {
                const password = result.password as string;
                const username = result.username as string;
                Logger.info(`Creating administrator..`);
                createAdmin(username, password);
                resolve(true)
            });
        });
    }
}