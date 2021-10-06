import prompt from "prompt";
import { CacheAdmin } from "../Cache/CacheAdmin";
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

            if(result.action === "show")
            {
                await this.show();
            }

            this.action();
        });
    }

    private async show()
    {
        Logger.info(CacheAdmin.array());
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