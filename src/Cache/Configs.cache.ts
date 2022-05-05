import { IConfigs } from "@interface/Admin/Configs.interface";
import ConfigModel from "../Database/Models/Configs.model";
import { TPayments } from "../Types/PaymentMethod";

export type CacheCN = keyof IConfigs;
// @ts-ignore
export const CacheConfig: Map<CacheCN, IConfigs[CacheCN]> & {
    save(): Promise<boolean>
} = new Map<CacheCN, IConfigs[CacheCN]>();

Object.defineProperty(CacheConfig, "save", {
    value: function()
    {
        return new Promise(async (resolve) =>
        {
            const config = await ConfigModel.find();
            if (!config[0])
                return resolve(false);

            // @ts-ignore
            config[0] = Object.fromEntries(this);
            // @ts-ignore
            await ConfigModel.updateOne({}, config[0], { upsert: true });

            return resolve(true);
        });
    }
});

export const getEnabledPaymentMethods = () => CacheConfig.get("payment_methods") as unknown as Array<Partial<TPayments>>;