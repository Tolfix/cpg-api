import { Application, Router } from "express";
import TransactionsModel from "../../../../Database/Models/Transactions.model";
import { APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";

export = TaxesRouter;
class TaxesRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/taxes`, this.router);

        this.router.get("/declaration/:start_date/:end_date", EnsureAdmin(), async (req, res) =>
        {
            const start_date = req.params.start_date;
            const end_date = req.params.end_date;

            // Get all transactions for the given date range
            const transactions = await TransactionsModel.find({
                date: {
                    $gte: start_date,
                    $lte: end_date,
                },
            });

            return APISuccess({
                transactions,
            })(res);
        });

    }

}