import { stripIndent } from "common-tags";
import prompt from "prompt";
import { CacheAdmin } from "../Cache/Admin.cache";
import { cron_chargeStripePayment, cron_notifyInvoices, cron_notifyLateInvoicePaid } from "../Cron/Methods/Invoices.cron.methods";
import AdminModel from "../Database/Models/Administrators.model";
import ConfigModel from "../Database/Models/Configs.model";
import Logger from "../Lib/Logger";
import { getPlugins, installPlugin } from "../Plugins/PluginHandler";
import createAdmin from "./CreateAdmin";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Prompt, { cacheCommands } from "./Commands/Prompt";
import inquirer from 'inquirer';

export interface ICommandsAdmin
{
    [key: string]: {
        description: string;
        method: any;
        [key: string]: any;
    }
}

export default class AdminHandler
{

    constructor()
    {
        console.log(
            chalk.green(
                figlet.textSync("CPG Admin", {
                    horizontalLayout: "full",
                    verticalLayout: "full"
                })
            )
        )
        this.action();
    }

    private action()
    {
        inquirer.prompt(Prompt().args).then(async (value) =>
        {
            clear();
            console.log(
                chalk.green(
                    figlet.textSync("CPG Admin", {
                        horizontalLayout: "full",
                        verticalLayout: "full"
                    })
                )
            )
            try
            {
                const cName = value.commands;
                const command = cacheCommands.get(cName);
                if(command)
                {
                    const value = await inquirer.prompt(command.args)
                    await command.method(value);
                }
            }
            finally
            {
                this.action();
            }
        }).catch((error) =>
        {
            console.log(error)
        });
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
                if(!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
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