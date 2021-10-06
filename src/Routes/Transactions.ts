import { Application, Router } from "express";
import { CacheTransactions } from "../Cache/CacheTransactions";
import { ITransactions } from "../Interfaces/Transactions";
import Logger from "../Lib/Logger";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

export default class TransactionsRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/transactions", this.router);

        /**
         * Gets all transactions
         * @route GET /transactions
         * @group Transactions
         * @returns {Array} 200 - An array of transactions
         * @security JWT
         * @security Basic
         */
        this.router.get("/", EnsureAdmin, (req, res) => {
            APISuccess({
                transactions: CacheTransactions.array(),
            })(res);
        });

        /**
         * Gets specific transactions
         * @route GET /transactions/{uid}
         * @group Transactions
         * @param {string} uid.path.required - The uid of transactions.
         * @returns {Array} 200 - The transactions
         * @returns {Error} 400 - Unable to find by uid
         * @security JWT
         * @security Basic
         */    
        this.router.get("/:uid", EnsureAdmin, (req, res) => {
            const uid = req.params.uid as ITransactions["uid"];

            const transaction = CacheTransactions.get(uid);

            if(!transaction)
                return APIError({
                    text: `Unable to find transactions by uid ${uid}`,
                })(res);

            return APISuccess({
                transaction: transaction,
            })(res);
        });

    }
}