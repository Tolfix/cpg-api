import { Application, Router } from "express";
import { APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import { CacheConfig } from "../../../../Cache/Configs.cache";
import { ISmtp } from "@interface/Admin/Configs.interface";
import { A_CC_Payments, TPayments } from "../../../../Types/PaymentMethod";

export = ConfigRouter; 
class ConfigRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/config`, this.router);

        this.router.get("/", EnsureAdmin(), (req, res) =>
        {
            return APISuccess(Object.fromEntries(CacheConfig))(res);
        });

        this.router.post("/smtp", EnsureAdmin(), async (req, res) =>
        {
            const { host, port, secure, username, password } = req.body;
            const config = CacheConfig.get("smtp") as ISmtp;
            
            if (host && config.host !== host)
                config.host = host;

            if (port && config.port !== port)
                config.port = port;

            if (secure && config.secure !== secure)
                config.secure = secure;

            if (username && config.username !== username)
                config.username = username;

            if (password && config.password !== password)
                config.password = password;

            CacheConfig.set("smtp", config);
            await CacheConfig.save();

            return APISuccess(Object.fromEntries(CacheConfig))(res);
        });

        this.router.get("/payment_methods", (req, res) =>
        {
            return APISuccess(A_CC_Payments)(res);
        });

        this.router.post("/payment_methods", EnsureAdmin(), async (req, res) =>
        {
            const { payment_methods } = req.body;
            
            // Check if array
            if (!Array.isArray(payment_methods))
                return APISuccess(`Has to be an array`)(res);

            // Check if the payment methods are valid
            const valid = payment_methods.every((p: TPayments) =>
            {
                return A_CC_Payments.includes(p);
            });

            if (!valid)
                return APISuccess(`Invalid payment_methods`)(res);

            let config = CacheConfig.get("payment_methods") as Array<Partial<TPayments>>;
            
            // @ts-ignore
            config = payment_methods;

            CacheConfig.set("payment_methods", config);
            await CacheConfig.save();

            return APISuccess(Object.fromEntries(CacheConfig))(res);
        });

    }

}