import { Application, Router } from "express";
import { APIError, APISuccess } from "../../../../Lib/Response";
import { PaypalCurrencies } from "../../../../Payments/Currencies/Paypal.currencies";
import { convertCurrency, currencyCodes, GetCurrencySymbol, TPaymentCurrency } from '../../../../Lib/Currencies';
export = CurrenciesRouter; 
class CurrenciesRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/currencies`, this.router);

        this.router.get("/", (req, res) =>
        {
            return APISuccess(currencyCodes)(res);
        });

        this.router.get("/paypals", (req, res) =>
        {
            return APISuccess(PaypalCurrencies)(res);
        });

        this.router.get("/:code/symbol", (req, res) =>
        {
            const code = currencyCodes.find(c => c === req.params.code.toUpperCase()) as TPaymentCurrency;
            if(!code)
                return APIError("Invalid code")(res);
            return APISuccess(GetCurrencySymbol(code))(res);
        });

        this.router.get("/convert/:from/:to/:amount", async (req, res) =>
        {
            const from = currencyCodes.find(c => c === req.params.from.toUpperCase()) as TPaymentCurrency;
            const to = currencyCodes.find(c => c === req.params.to.toUpperCase()) as TPaymentCurrency;
            const amount = Number(req.params.amount);
            if(!from || !to || !amount)
                return APIError("Invalid parameters")(res);
            return APISuccess(await convertCurrency(amount, from, to))(res);
        });

    }

}