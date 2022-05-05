import Logger from "../Lib/Logger";
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
        inquirer.registerPrompt('search-list', require('inquirer-search-list'));
        inquirer.registerPrompt('search-checkbox', require('inquirer-search-checkbox'));
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
                if (command)
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

}