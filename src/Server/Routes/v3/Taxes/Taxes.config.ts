import { Application, Router } from "express";
import TransactionsModel from "../../../../Database/Models/Transactions.model";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
// @ts-ignore
import pdfdocs from "pdfkit-table";
import { Company_Currency } from "../../../../Config";
import { convertCurrency } from "../../../../Lib/Currencies";

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

            const companyCurrency = await Company_Currency();

            const doc = new pdfdocs({
                size: "A4",
                margin: 50,
            });

            const income = {
                title: "Income",
                headers: [
                    "Id",
                    "Date",
                    "Invoice ID",
                    "Customer ID",
                    "Total",
                    "Fees",
                    "Payment method"
                ],
                rows: transactions.filter(e => e.statement === "income").map((t) =>
                {
                    return [
                        t.id,
                        t.date,
                        t.invoice_uid,
                        t.customer_uid,
                        `${t.amount.toFixed(2)} ${t.currency}`,
                        t.fees,
                        t.payment_method,
                    ];
                }),
            };

            doc.table(income);

            const expense = {
                title: "Expense",
                headers: [
                    "Date",
                    "Invoice ID",
                    "Customer",
                    "Total",
                    "Fees",
                ],
                rows: transactions.filter(e => e.statement === "expense").map((t) =>
                {
                    return [
                        t.date,
                        t.invoice_uid,
                        t.customer_uid,
                        t.amount,
                        t.fees,
                    ];
                }),
            };

            doc.table(expense);

            const nTotal = {
                expense: (await Promise.all(transactions.filter(e => e.statement === "expense").map(async (e) =>
                {
                    // Convert to company currency
                    return (await convertCurrency(e.amount, e.currency, companyCurrency));
                }))).reduce((a, b) => a + b, 0).toFixed(2),
                income: (await Promise.all(transactions.filter(e => e.statement === "income").map(async (e) =>
                {
                    // Convert to company currency
                    return (await convertCurrency(e.amount, e.currency, companyCurrency));
                }))).reduce((a, b) => a + b, 0).toFixed(2)
            }

            const total = {
                title: "Total",
                headers: [
                    "From",
                    "To",
                    "Total income",
                    "Total expense",
                    "Total"
                ],
                rows: [
                    [
                        start_date,
                        end_date,
                        nTotal.income + ` ${companyCurrency}`,
                        nTotal.expense + ` ${companyCurrency}`,
                        (parseFloat(nTotal.income) - parseFloat(nTotal.expense)).toFixed(2) + ` ${companyCurrency}`
                    ],
                ],
            }

            doc.table(total);

            doc.pipe(res);

            // done
            doc.end();
        });

    }

}