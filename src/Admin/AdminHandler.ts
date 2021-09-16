import prompt from "prompt";
import Logger from "../Lib/Logger";
import createAdmin from "./CreateAdmin";

export default class AdminHandler
{
    constructor()
    {
        prompt.start();
        this.action();
    }

    private action()
    {
        prompt.get(['action'], async (err, result) => {

            if(result.action === "create")
            {
                await this.create();
            }

            this.action();
        });
    }

    private async create()
    {
        return new Promise((resolve, reject) => {
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
            ], async (err, result) => {
                const password = result.password as string;
                const username = result.username as string;
                Logger.info(`Creating administrator..`);
                createAdmin(username, password);
                resolve(true)
            });
        });
    }
}