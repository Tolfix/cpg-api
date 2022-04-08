import prompt from "prompt";
import ConfigModel from "../Database/Models/Configs.model";
import Logger from "../Lib/Logger";
import { getPlugins, installPlugin } from "../Plugins/PluginHandler";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Prompt, { cacheCommands } from "./Commands/Prompt";
import inquirer from 'inquirer';

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
            Logger.error(error);
            this.action();
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