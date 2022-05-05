/* eslint-disable no-case-declarations */
import Logger from "../../Lib/Logger";
import prompt from "prompt";
import AdminModel from "../../Database/Models/Administrators.model";
import createAdmin from "../CreateAdmin";

export default
{
    name: 'Admin',
    description: 'Get all admin jobs',
    args: [
        {
            name: 'action',
            type: "list",
            message: "Select the admin job you want to run",
            choices: [
                {
                    name: 'Show admins',
                    value: 'show_admins',
                },
                {
                    name: 'Create admin',
                    value: 'create_admin',
                },
                {
                    name: 'Delete admin',
                    value: 'delete_admin',
                }
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch (action)
        {
            case 'show_admins':
                // Getting all invoices
                Logger.info(`Admins:`, await AdminModel.find());
                break; 

            case 'create_admin':
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
            case 'delete_admin':
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
                                if (err)
                                    Logger.error(err);
                                    
                                Logger.info(`Successfully deleted administrator ${username}`);
                            });
                            resolve(true)
                        });
                    });
                }
        }
        return true;
    }
}