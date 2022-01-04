import ConfigModel from "./Database/Models/Configs";
import { IConfigs } from "./Interfaces/Admin/Configs";

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

// Company
// Later change this to a databse etc..
export const Company_Name = process.env.COMPANY_NAME ?? "";
export const Company_Address = process.env.COMPANY_ADDRESS ?? "";
export const Company_Zip = process.env.COMPANY_ZIP ?? "";
export const Company_City = process.env.COMPANY_CITY ?? "";
export const Company_Country = process.env.COMPANY_COUNTRY ?? "";
export const Company_Phone = process.env.COMPANY_PHONE ?? "";
export const Company_Email = process.env.COMPANY_EMAIL ?? "";
export const Company_Vat = process.env.COMPANY_VAT ?? "";
export const Company_Currency = process.env.COMPANY_CURRENCY ?? "sek";
export const Company_Tax_Registered = process.env.COMPANY_TAX_REGISTERED === "true" ? true : false;
export const Company_Logo_Url = process.env.COMPANY_LOGO_URL ?? "";
export const Company_Website = process.env.COMPANY_WEBSITE ?? "";

// PDF
export const PDF_Template_Url = process.env.PDF_TEMPLATE_URL ?? "";

// Plugins
export const Plugins: Array<string> = JSON.parse(process.env.PLUGINS ?? "[]");

// Webhooks
export const Webhook_Secret = process.env.WEBHOOK_SECRET ?? "";

export const GetSMTPConfig: () => Promise<IConfigs["smtp"]> = () =>
{
    return ConfigModel.find().then(config => {
        //@ts-ignore
        return config[0].smtp;
    });
};

export const GetSMTPEmails: () => Promise<IConfigs["smtp_emails"]> = () =>
{
    return ConfigModel.find().then(config => {
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