import { Application, Router } from "express";
import { APISuccess } from "../../../../Lib/Response";
import { A_CC_Payments, A_RecurringMethod } from "../../../../Types/PaymentMethod";
import { A_PaymentTypes } from "../../../../Types/PaymentTypes";
export = PaymentsRouter;
class PaymentsRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/payments`, this.router);

        this.router.get("/", (req, res) =>
        {
            return APISuccess({
                payment_types: A_CC_Payments,
                recurring_methods: A_RecurringMethod,
                order_payment_types: A_PaymentTypes,
            })(res);
        });

    }

}