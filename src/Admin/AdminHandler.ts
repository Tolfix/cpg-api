import { stripIndent } from "common-tags";
import prompt from "prompt";
import { CacheAdmin } from "../Cache/Admin.cache";
import AdminModel from "../Database/Models/Administrators.model";
import ConfigModel from "../Database/Models/Configs.model";
import Logger from "../Lib/Logger";
import { getPlugins, installPlugin } from "../Plugins/PluginHandler";
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
        prompt.get(['action'], async (err, result) =>
        {

            if(result.action === "help")
                Logger.info(stripIndent`
                Available actions:
                    Emails:
                        add_email
                        delete_email
                        show_emails

                    Admin:
                        create_admin
                        delete_admin
                        show_admins

                    SMTP:
                        update_smtp
                        show_smtp

                    General:
                        help

                    Webhooks:
                        add_webhook
                        delete_webhook
                        show_webhooks

                    Company:
                        update_company

                    Plugins:
                        show_plugins
                        update_plugin
                `);

            if(result.action === "create_admin")
                await this.create();

            if(result.action === "show_admins")
                await this.show();

            if(result.action === "update_smtp")
                await this.update_smtp();

            if(result.action === "show_smtp")
                await this.show_smtp();

            if(result.action === "delete_admin")
                await this.delete_admin();

            if(result.action === "add_email")
                await this.add_email();

            if(result.action === "delete_email")
                await this.delete_email();

            if(result.action === "show_emails")
                await this.show_emails();

            if(result.action === "add_webhook")
                await this.add_webhook();

            if(result.action === "delete_webhook")
                await this.delete_webhook();

            if(result.action === "show_webhooks")
                await this.show_webhooks();

            if(result.action === "update_company")
                await this.update_company();

            if(result.action === "show_plugins")
                await this.show_plugins();

            if(result.action === "update_plugin")
                await this.update_plugin();

            this.action();
        });
    }


    private async update_smtp()
    {
        const config = (await ConfigModel.find())[0];
        return new Promise((resolve) =>
        {
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
            ], async (err, result) =>
            {
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

    private async show_emails()
    {
        return new Promise(async (resolve,) =>
        {
            // Get our config from database
            const config = (await ConfigModel.find())[0];
            Logger.info(`Emails:`, config.smtp_emails);
            resolve(true);
        });
    }

    private async show_smtp()
    {
        return new Promise(async (resolve) =>
        {
            // Get our config from database
            const config = (await ConfigModel.find())[0];
            Logger.info(`SMTP Settings:`, config.smtp);
            resolve(true);
        });
    }

    private async create()
    {
        return new Promise((resolve) =>
        {
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
            ], async (err, result) =>
            {
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
        return new Promise((resolve) =>
        {
            prompt.get([
                {
                    name: "username",
                    description: "Username for administrator",
                    required: true
                },
            ], async (err, result) =>
            {
                const username = result.username as string;
                Logger.info(`Deleting administrator..`);

                AdminModel.findOneAndUpdate({ username: username }, (err: any) =>
                {
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
        return new Promise((resolve) =>
        {
            prompt.get([
                {
                    name: "email",
                    description: "Email for administrator",
                    required: true
                },
            ], async (err, result) =>
            {
                const email = result.email as string;
                Logger.info(`Adding email..`);
                // Check if email is valid
                // eslint-disable-next-line no-useless-escape
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
        return new Promise((resolve) =>
        {
            prompt.get([
                {
                    name: "email",
                    description: "Email for administrator",
                    required: true
                },
            ], async (err, result) =>
            {
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

    
    private async add_webhook()
    {
        return new Promise((resolve) =>
        {
            prompt.get([
                {
                    name: "url",
                    description: "URL for webhook",
                    required: true
                },
            ], async (err, result) =>
            {
                const url = result.url as string;
                Logger.info(`Adding webhook..`);
                // Get our config from database
                const config = (await ConfigModel.find())[0];

                // Add webhook
                config.webhooks_urls.push(url);

                // Save our config
                await config.save();
                return resolve(true)
            });
        });
    }

    private async delete_webhook()
    {
        return new Promise((resolve) =>
        {
            prompt.get([
                {
                    name: "url",
                    description: "URL for webhook",
                    required: true
                },
            ], async (err, result) =>
            {
                const url = result.url as string;
                Logger.info(`Deleting webhook..`);
                // Get our config from database
                const config = (await ConfigModel.find())[0];

                // Remove webhook
                config.webhooks_urls = config.webhooks_urls.filter((e: any) => e !== url);

                // Save our config
                await config.save();
                return resolve(true)
            });
        });
    }

    private async show_webhooks()
    {
        return new Promise(async (resolve) =>
        {
            // Get our config from database
            const config = (await ConfigModel.find())[0];
            Logger.info(`Webhooks:`, config.webhooks_urls);
            resolve(true);
        });
    }

    private async update_company()
    {
        return new Promise(async (resolve) =>
        {
            // Get our config from database
            const config = (await ConfigModel.find())[0];
            Logger.info(`Current company:`, config.company);
            if(!config.company)
                // @ts-ignore
                config.company = {};
            
            prompt.get([
                {
                    name: "name",
                    description: "Company name",
                    default: config.company?.name ?? "",
                    required: false
                },
                {
                    name: "address",
                    description: "Company address",
                    default: config.company?.address ?? "",
                    required: false
                },
                {
                    name: "city",
                    description: "Company city",
                    default: config.company?.city ?? "",
                    required: false
                },
                {
                    name: "country",
                    description: "Company country",
                    default: config.company?.country ?? "",
                    required: false
                },
                {
                    name: "zip",
                    description: "Company zip",
                    default: config.company?.zip ?? "",
                    required: false
                },
                {
                    name: "phone",
                    description: "Company phone",
                    default: config.company?.phone ?? "",
                    required: false
                },
                {
                    name: "vat",
                    description: "Company vat",
                    default: config.company?.vat ?? "",
                    required: false
                },
                {
                    name: "email",
                    description: "Company email",
                    default: config.company?.email ?? "",
                    required: false
                },
                {
                    name: "website",
                    description: "Company website",
                    default: config.company?.website ?? "",
                    required: false
                },
                {
                    name: "logo_url",
                    description: "Company logo url",
                    default: config.company?.logo_url ?? "",
                    required: false
                },
                {
                    name: "tax_registered",
                    description: "Company tax registered",
                    default: config.company?.tax_registered ?? "",
                    required: false,
                    enum: ["true", "false"],
                    type: "boolean"
                },
                {
                    name: "currency",
                    description: "Company currency",
                    default: config.company?.currency ?? "",
                    required: false,
                },
            ], async (err, result) =>
            {
                Logger.info(`Updating company..`);
                config.company = {
                    name: result.name as string,
                    address: result.address as string,
                    city: result.city as string,
                    country: result.country as string,
                    zip: result.zip as string,
                    phone: result.phone as string,
                    vat: result.vat as string,
                    email: result.email as string,
                    logo_url: result.logo_url as string,
                    tax_registered: result.tax_registered as boolean,
                    currency: result.currency as string,
                    website: result.website as string
                };

                // Save our config
                await config.save();
                return resolve(true)
            });
        });
        
        
    }

    private async show_plugins()
    {
        return new Promise(async (resolve) =>
        {
            // Get our config from database
            const plugins = getPlugins()
            Logger.info(`Plugins:`, ...plugins);
            resolve(true);
        });
    }

    private async update_plugin()
    {
        return new Promise(async (resolve) =>
        {
            prompt.get([
                {
                    name: "plugin",
                    description: "Plugin",
                    required: false,
                    type: "string",
                },
            ], async (err, result) =>
            {
                Logger.info(`Updating plugins..`);
                const plugin = result.plugin as string;
                if(plugin)
                    await installPlugin(`${plugin}@latest`);
                return resolve(true)
            });
        });
    }
}