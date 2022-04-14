/* eslint-disable no-case-declarations */
import Logger from "../../Lib/Logger";
import prompt from "prompt";
import { CacheConfig } from "../../Cache/Configs.cache";
import ConfigModel from "../../Database/Models/Configs.model";
import { TPaymentCurrency } from "../../Lib/Currencies";

export default
{
    name: 'Company',
    description: 'Get all company jobs',
    args: [
        {
            name: 'action',
            type: "list",
            message: "Select the company job you want to run",
            choices: [
                {
                    name: 'Show company',
                    value: 'show_company',
                },
                {
                    name: 'Update company settings',
                    value: 'update_company_settings',
                },
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch(action)
        {
            case 'show_company':
                // Getting all invoices
                Logger.info(`Company Settings:`, CacheConfig.get("company"));
                break; 

            case 'update_company_settings':
                {
                    return new Promise(async (resolve) =>
                    {
                        // Get our config from database
                        const config = (await ConfigModel.find())[0];
                        Logger.info(`Current company:`, config.company);
                        if(!config.company)
                            // @ts-ignore
                            config.company = {};
                        
                        prompt.get([
                            {
                                name: "name",
                                description: "Company name",
                                default: config.company?.name ?? "",
                                required: false
                            },
                            {
                                name: "address",
                                description: "Company address",
                                default: config.company?.address ?? "",
                                required: false
                            },
                            {
                                name: "city",
                                description: "Company city",
                                default: config.company?.city ?? "",
                                required: false
                            },
                            {
                                name: "country",
                                description: "Company country",
                                default: config.company?.country ?? "",
                                required: false
                            },
                            {
                                name: "zip",
                                description: "Company zip",
                                default: config.company?.zip ?? "",
                                required: false
                            },
                            {
                                name: "phone",
                                description: "Company phone",
                                default: config.company?.phone ?? "",
                                required: false
                            },
                            {
                                name: "vat",
                                description: "Company vat",
                                default: config.company?.vat ?? "",
                                required: false
                            },
                            {
                                name: "email",
                                description: "Company email",
                                default: config.company?.email ?? "",
                                required: false
                            },
                            {
                                name: "website",
                                description: "Company website",
                                default: config.company?.website ?? "",
                                required: false
                            },
                            {
                                name: "logo_url",
                                description: "Company logo url",
                                default: config.company?.logo_url ?? "",
                                required: false
                            },
                            {
                                name: "tax_registered",
                                description: "Company tax registered",
                                default: config.company?.tax_registered ?? "",
                                required: false,
                                enum: ["true", "false"],
                            },
                            {
                                name: "currency",
                                description: "Company currency",
                                default: config.company?.currency ?? "",
                                required: false,
                            },
                        ], async (err, result) =>
                        {
                            Logger.info(`Updating company..`);
                            config.company = {
                                name: result.name as string,
                                address: result.address as string,
                                city: result.city as string,
                                country: result.country as string,
                                zip: result.zip as string,
                                phone: result.phone as string,
                                vat: result.vat as string,
                                email: result.email as string,
                                logo_url: result.logo_url as string,
                                tax_registered: result.tax_registered === "true",
                                currency: result.currency as TPaymentCurrency,
                                website: result.website as string
                            };
            
                            // Save our config
                            await config.save();
                            return resolve(true)
                        });
                    });
                }
        }
        return true;
    }
}