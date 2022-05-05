/* eslint-disable no-case-declarations */
import Logger from "../../Lib/Logger";
import prompt from "prompt";
import { CacheConfig } from "../../Cache/Configs.cache";
import ConfigModel from "../../Database/Models/Configs.model";
import updateSMTP from "../updateSMTP";

export default
{
    name: 'SMTP',
    description: 'Get all SMTP jobs',
    args: [
        {
            name: 'action',
            type: "list",
            message: "Select the SMTP job you want to run",
            choices: [
                {
                    name: 'Show SMTP settings',
                    value: 'show_smtp_settings',
                },
                {
                    name: 'Update SMTP settings',
                    value: 'update_smtp_settings',
                },
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch (action)
        {
            case 'show_smtp_settings':
                // Getting all invoices
                Logger.info(`SMTP Settings:`, CacheConfig.get("smtp"));
                break; 

            case 'update_smtp_settings':
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
                            await updateSMTP({
                                host,
                                port,
                                username,
                                password,
                                secure
                            });
                            resolve(true)
                        });
                    });
                    break;
                }
        }
        return true;
    }
}