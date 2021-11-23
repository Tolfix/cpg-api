import { stripIndent } from "common-tags";
import prompt from "prompt";
import { CacheAdmin } from "../Cache/CacheAdmin";
import AdminModel from "../Database/Schemas/Administrators";
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
                Logger.info(stripIndent`
                Available actions:
                    add_email,
                    delete_email,
                    create_admin,
                    delete_admin,
                    show_admins,
                    help,
                    update_smtp
                `);

            if(result.action === "create_admin")
                await this.create();

            if(result.action === "show_admins")
                await this.show();

            if(result.action === "update_smtp")
                await this.update_smtp();

            if(result.action === "delete_admin")
                await this.delete_admin();

            if(result.action === "add_email")
                await this.add_email();

            if(result.action === "delete_email")
                await this.delete_email();
            
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

    private async delete_admin()
    {
        return new Promise((resolve, reject) => {
            prompt.get([
                {
                    name: "username",
                    description: "Username for administrator",
                    required: true
                },
            ], async (err, result) => {
                const username = result.username as string;
                Logger.info(`Deleting administrator..`);

                AdminModel.findOneAndDelete({ username: username }, (err: any) => {
                    if(err)
                        Logger.error(err);
                        
                    Logger.info(`Successfully deleted administrator ${username}`);
                });
                resolve(true)
            });
        });
    }

    private async add_email()
    {
        return new Promise((resolve, reject) => {
            prompt.get([
                {
                    name: "email",
                    description: "Email for administrator",
                    required: true
                },
            ], async (err, result) => {
                const email = result.email as string;
                Logger.info(`Adding email..`);
                // Check if email is valid
                if(!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
                {
                    Logger.error(`Invalid email`);
                    return resolve(false);
                }
                // Get our config from database
                const config = (await ConfigModel.find())[0];

                config.smtp_emails.push(email);

                // Save our config
                await config.save();
                return resolve(true)
            });
        });
    }

    private async delete_email()
    {
        return new Promise((resolve, reject) => {
            prompt.get([
                {
                    name: "email",
                    description: "Email for administrator",
                    required: true
                },
            ], async (err, result) => {
                const email = result.email as string;
                Logger.info(`Deleting email..`);
                // Get our config from database
                const config = (await ConfigModel.find())[0];

                // Remove email
                config.smtp_emails = config.smtp_emails.filter(e => e !== email);

                // Save our config
                await config.save();
                return resolve(true)
            });
        });
    }
}