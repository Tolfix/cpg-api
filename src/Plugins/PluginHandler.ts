import { Application } from "express";
import CategoryModel from "../Database/Schemas/Category";
import CustomerModel from "../Database/Schemas/Customer";
import ImageModel from "../Database/Schemas/Images";
import InvoiceModel from "../Database/Schemas/Invoices";
import OrderModel from "../Database/Schemas/Orders";
import ProductModel from "../Database/Schemas/Products";
import TransactionsModel from "../Database/Schemas/Transactions";
import mainEvent from "../Events/Main";
import Logger from "../Lib/Logger";
import { Plugins } from "../Config";
import npm from "npm";

// find installed npm packages in package.json and get plugins starting with cpg_plugin
// then require it and call the new 

export async function PluginHandler(server: Application)
{
    // get plugins from package.json
    Logger.info("Loading plugins");
    const plugins = getPlugins();
    for await(const plugin of plugins)
    {
        await installPlugin(plugin);

        Logger.plugin(`Installed plugin ${plugin}`)
        // @ts-ignore
        const pluginInstance = require(plugin);
        // @ts-ignore
        new pluginInstance(mainEvent, server, {
            // All database models
            CategoryModel: CategoryModel,
            CustomerModel: CustomerModel,
            ImageModel: ImageModel,
            InvoiceModel: InvoiceModel,
            OrderModel: OrderModel,
            ProductModel: ProductModel,
            TransactionsModel: TransactionsModel,            
        }, Logger);

        Logger.plugin(`Loaded plugin ${plugin}`)
    }
}

export function installPlugin(plugin: string)
{
    return new Promise((resolve, reject) => {
        npm.load(function(err)
        {
            if(err)
            {
                Logger.error(err);
                return reject(err);
            }
            npm.commands.install([plugin], function(err, data)
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

export function getPlugins()
{
    // get all installed npm packages
    const packages = Plugins;
    // get plugins starting with cpg-plugin
    const plugins = packages.filter(p => p.startsWith("cpg-plugin"));
    return plugins;
}
