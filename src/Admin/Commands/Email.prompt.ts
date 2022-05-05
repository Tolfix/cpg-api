/* eslint-disable no-case-declarations */
import Logger from "../../Lib/Logger";
import prompt from "prompt";
import ConfigModel from "../../Database/Models/Configs.model";

export default
{
    name: 'Emails',
    description: 'Get all email jobs',
    args: [
        {
            name: 'action',
            type: "list",
            message: "Select the email job you want to run",
            choices: [
                {
                    name: 'Show emails',
                    value: 'show_emails',
                },
                {
                    name: 'Add email',
                    value: 'add_email',
                },
                {
                    name: 'Delete email',
                    value: 'delete_email',
                }
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch (action)
        {
            case 'show_emails':
                return new Promise(async (resolve,) =>
                {
                    // Get our config from database
                    const config = (await ConfigModel.find())[0];
                    Logger.info(`Emails:`, config.smtp_emails);
                    resolve(true);
                });

            case 'add_email':
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
                        if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
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
            case 'delete_email':
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
        return true;
    }
}