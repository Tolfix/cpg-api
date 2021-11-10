import ConfigModel from "./Database/Schemas/Configs";
import { IConfigs } from "./Interfaces/Admin/Configs";

/**
 * @description
 * Used if this service is running in debug mode.
 */
export const DebugMode = process.env.DEBUG === "true" ? true : false;
export const HomeDir = ((__dirname.replace("\\build", "")).replace("/build", ""));
export const JWT_Access_Token = process.env.JWT_ACCESS_TOKEN ?? "";
export const d_Days = parseInt(process.env.D_DAYS ?? "30");

export const PORT = process.env.PORT ?? 8080;

export const Express_Session_Secret = process.env.SESSION_SECRET ?? require("crypto").randomBytes(20).toString("hex");

export const MongoDB_URI = process.env.MONGO_URI ?? "mongodb://localhost/cpg";

// osTicket configs
export const osticket_url = process.env.OSTICKET_URL ?? "";
export const osticket_api_key = process.env.OSTICKET_API_KEY ?? "";
 
// Stripe
export const Stripe_SK_Test = process.env.STRIPE_SK_TEST ?? "";
export const Stripe_SK_Live = process.env.STRIPE_SK_LIVE ?? "";
export const Stripe_SK_Public_Test = process.env.STRIPE_SK_PUBLIC_TEST ?? "";

export const GetSMTPConfig: () => Promise<IConfigs["smtp"]> = () => {
    return ConfigModel.find().then(config => {
        //@ts-ignore
        return config[0].smtp;
    });
}