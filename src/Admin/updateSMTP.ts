import ConfigModel from "../Database/Models/Configs.model";
import { IConfigs } from "@interface/Admin/Configs.interface";

export default async function updateSMTP(smtp: IConfigs["smtp"]): Promise<void>
{
    // Get our config from database
    const config = (await ConfigModel.find())[0];

    config.smtp = smtp;

    // Save our config
    await config.save();
}