import { Application } from "express";
import { HomeDir } from "../Config";
import CategoryModel from "../Database/Schemas/Category";
import CustomerModel from "../Database/Schemas/Customer";
import ImageModel from "../Database/Schemas/Images";
import InvoiceModel from "../Database/Schemas/Invoices";
import OrderModel from "../Database/Schemas/Orders";
import ProductModel from "../Database/Schemas/Products";
import TransactionsModel from "../Database/Schemas/Transactions";
import mainEvent from "../Events/Main";
import Logger from "../Lib/Logger";

// find installed npm packages in package.json and get plugins starting with cpg_plugin
// then require it and call the new 

export function PluginHandler(server: Application)
{
    // get plugins from package.json
    Logger.info("Loading plugins");
    const plugins = getPlugins();
    for(const plugin of plugins)
    {
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
        });
    }
}

export function getPlugins()
{

    // get all installed npm packages
    const packages = require(`${HomeDir}/package.json`).dependencies;
    // get plugins starting with cpg-plugin
    const plugins = Object.keys(packages).filter((key) => key.startsWith("cpg-plugin-"));
    return plugins;

}
