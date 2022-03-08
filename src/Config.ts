import ConfigModel from "./Database/Models/Configs.model";
import { IConfigs } from "./Interfaces/Admin/Configs.interface";
import { IAllLanguages } from "./Interfaces/Lang/AllLang.interface";

/**
 * @description
 * Used if this service is running in debug mode.
 */
export const DebugMode = process.env.DEBUG === "true" ? true : false;
export const HomeDir = ((__dirname.replace("\\build", "")).replace("/build", ""));
export const JWT_Access_Token = process.env.JWT_ACCESS_TOKEN ?? "";
export const d_Days = parseInt(process.env.D_DAYS ?? "30");
export const Domain = process.env.DOMAIN ?? "localhost";
export const Http_Schema = process.env.HTTP_SCHEMA ?? "http";
export const PORT = process.env.PORT ?? 8080;
export const Full_Domain = `${Http_Schema}://${Domain === "localhost" ? `localhost:${PORT}` : Domain}`;

// API
export const Express_Session_Secret = process.env.SESSION_SECRET ?? require("crypto").randomBytes(20).toString("hex");

// Database
export const MongoDB_URI = process.env.MONGO_URI ?? "mongodb://localhost/cpg";
//  // Postgres
export const Postgres_User = process.env.POSTGRES_USER ?? "";
export const Postgres_Password = process.env.POSTGRES_PASSWORD ?? "";
export const Postgres_Database = process.env.POSTGRES_DATABASE ?? "";
export const Postgres_Port = parseInt(process.env.POSTGRES_PORT ?? "5432");
export const Postgres_Host = process.env.POSTGRES_HOST ?? "localhost";

// osTicket configs
export const osticket_url = process.env.OSTICKET_URL ?? "";
export const osticket_api_key = process.env.OSTICKET_API_KEY ?? "";
 
// Stripe
export const Stripe_SK_Test = process.env.STRIPE_SK_TEST ?? "";
export const Stripe_SK_Live = process.env.STRIPE_SK_LIVE ?? "";
export const Stripe_PK_Public_Test = process.env.STRIPE_SK_PUBLIC_TEST ?? "";
export const Stripe_PK_Public = process.env.STRIPE_SK_PUBLIC ?? "";
export const Stripe_Webhook_Secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Swish
export const Swish_Payee_Number = process.env.SWISH_PAYEE_NUMBER ?? "";

// Paypal
export const Paypal_Client_Id = process.env.PAYPAL_CLIENT_ID ?? "";
export const Paypal_Client_Secret = process.env.PAYPAL_CLIENT_SECRET ?? "";

// CPG stuff..
export const CPG_Customer_Panel_Domain = process.env.CPG_CUSTOMER_PANEL_DOMAIN;
export const CPG_Shop_Domain = process.env.CPG_SHOP_DOMAIN;
export const CPG_Admin_Panel_Domain = process.env.CPG_ADMIN_PANEL_DOMAIN;

// Company
// Later change this to a databse etc..
export const Company_Name = async (): Promise<IConfigs["company"]["name"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.name === "" ? undefined : configs.company?.name) ?? process.env.COMPANY_NAME ?? "";
};
export const Company_Address = async (): Promise<IConfigs["company"]["address"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.address === "" ? undefined : configs.company?.address) ?? process.env.COMPANY_ADDRESS ?? "";
}
export const Company_Zip = async (): Promise<IConfigs["company"]["zip"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.zip === "" ? undefined : configs.company?.zip) ?? process.env.COMPANY_ZIP ?? "";
}
export const Company_City = async (): Promise<IConfigs["company"]["city"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.city === "" ? undefined : configs.company?.city) ?? process.env.COMPANY_CITY ?? "";
}
export const Company_Country = async (): Promise<IConfigs["company"]["country"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.country === "" ? undefined : configs.company?.country) ?? process.env.COMPANY_COUNTRY ?? "";
}
export const Company_Phone = async (): Promise<IConfigs["company"]["phone"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.phone === "" ? undefined : configs.company?.phone) ?? process.env.COMPANY_PHONE ?? "";
}
export const Company_Email = async (): Promise<IConfigs["company"]["email"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.email === "" ? undefined : configs.company?.email) ?? process.env.COMPANY_EMAIL ?? "";
}
export const Company_Vat = async (): Promise<IConfigs["company"]["vat"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.vat === "" ? undefined : configs.company?.vat) ?? process.env.COMPANY_VAT ?? "";
}
export const Company_Currency = async (): Promise<IConfigs["company"]["currency"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.currency === "" ? undefined : configs.company?.currency) ?? process.env.COMPANY_CURRENCY ?? "";
}
export const Company_Tax_Registered = async (): Promise<IConfigs["company"]["tax_registered"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return configs.company?.tax_registered ?? (process.env.COMPANY_TAX_REGISTERED === "true" ? true : false);
}
export const Company_Logo_Url = async (): Promise<IConfigs["company"]["logo_url"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.logo_url === "" ? undefined : configs.company?.logo_url) ?? process.env.COMPANY_LOGO_URL ?? "";
}
export const Company_Website = async (): Promise<IConfigs["company"]["website"]> =>
{
    const configs = await ConfigModel.findOne();
    if(!configs) throw new Error("No configs found");
    return (configs.company?.website === "" ? undefined : configs.company?.website) ?? process.env.COMPANY_WEBSITE ?? "";
}

export const Default_Language: keyof IAllLanguages = (
    process.env.DEFAULT_LANGUAGE ? process.env.DEFAULT_LANGUAGE as keyof IAllLanguages : "en"
);

// PDF
export const PDF_Template_Url = process.env.PDF_TEMPLATE_URL ?? "";

// Plugins
export const Plugins: Array<string> = JSON.parse(process.env.PLUGINS ?? "[]");

// Webhooks
export const Webhook_Secret = process.env.WEBHOOK_SECRET ?? "";

export const GetSMTPConfig: () => Promise<IConfigs["smtp"]> = async () =>
{
    return ConfigModel.find().then(config =>
    {
        //@ts-ignore
        return config[0].smtp;
    });
};

export const GetSMTPEmails: () => Promise<IConfigs["smtp_emails"]> = () =>
{
    return ConfigModel.find().then(config =>
    {
        //@ts-ignore
        return config[0].smtp_emails;
    });
};

// Get version of the app from package.json
export const GetVersion: () => string = () =>
{
    const package_json = require("../package.json");
    return (package_json?.version ?? "0.0.0");
};
