/* eslint-disable no-case-declarations */
import Logger from "../../Lib/Logger";
import prompt from "prompt";
import ConfigModel from "../../Database/Models/Configs.model";

export default
{
    name: 'Webhooks',
    description: 'Get all webhook jobs',
    args: [
        {
            name: 'action',
            type: "list",
            message: "Select the webhook job you want to run",
            choices: [
                {
                    name: 'Show webhooks',
                    value: 'show_webhooks',
                },
                {
                    name: 'Add webhook',
                    value: 'add_webhook',
                },
                {
                    name: 'Delete webhook',
                    value: 'delete_webhook',
                }
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch(action)
        {
            case 'show_webhooks':
                return new Promise(async (resolve) =>
                {
                    // Get our config from database
                    const config = (await ConfigModel.find())[0];
                    Logger.info(`Webhooks:`, config.webhooks_urls);
                    resolve(true);
                });

            case 'add_email':
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
            case 'delete_email':
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
        return true;
    }
}