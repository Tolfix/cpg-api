import { Application } from "express";
import CategoryModel from "../Database/Models/Category.model";
import CustomerModel from "../Database/Models/Customers/Customer.model";
import ImageModel from "../Database/Models/Images.model";
import InvoiceModel from "../Database/Models/Invoices.model";
import OrderModel from "../Database/Models/Orders.model";
import ProductModel from "../Database/Models/Products.model";
import TransactionsModel from "../Database/Models/Transactions.model";
import ConfigurableOptionsModel from "../Database/Models/ConfigurableOptions.model";
import mainEvent from "../Events/Main.event";
import Logger from "../Lib/Logger";
import { Plugins } from "../Config";
import npm from "npm";
import fs from "fs";
import MainCache from "../Cache/Cache.cache";
import GetText from "../Translation/GetText";

// find installed npm packages in package.json and get plugins starting with cpg_plugin
// then require it and call the new 

export async function PluginHandler(server: Application)
{
    // get plugins from package.json
    Logger.plugin(GetText().plugins.txt_Plugin_Loading);
    // Logger.plugin("Loading plugins...");
    const plugins = getPlugins();
    for await(const plugin of plugins)
    {
        if(!(await isPluginInstalled(plugin)))
        {
            await installPlugin(plugin);
            Logger.plugin(GetText().plugins.txt_Plugin_Installed(plugin));
            // Logger.plugin(`Installed plugin ${plugin}`)
        }

        // @ts-ignore
        require(plugin)();

        Logger.plugin(GetText().plugins.txt_Plugin_Loaded(plugin));
        // Logger.plugin(`Loaded plugin ${plugin}`);
    }
}

export function installPlugin(plugin: string)
{
    return new Promise((resolve, reject) =>
    {
        npm.load(function(err)
        {
            if(err)
            {
                Logger.error(err);
                return reject(err);
            }
            npm.commands.install([plugin], function(err)
            {
                if(err)
                {
                    Logger.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
    }) 
}

export function isPluginInstalled(plugin: string)
{
    return new Promise((resolve) =>
    {
        // Check node_modules for plugin
        const pluginPath = `${process.cwd()}/node_modules/${plugin}`;
        if(!fs.existsSync(pluginPath))
            return resolve(false);
        resolve(true);
    });
}

export function getPlugins()
{
    // get all installed npm packages
    const packages = Plugins;
    // get plugins starting with cpg-plugin
    const plugins = packages.filter(p => p.startsWith("cpg-plugin"));
    return plugins;
}