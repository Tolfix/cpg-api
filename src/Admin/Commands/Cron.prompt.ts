import { cron_chargeStripePayment, cron_notifyInvoices, cron_notifyLateInvoicePaid } from "../../Cron/Methods/Invoices.cron.methods";
import { cron_createNewInvoicesFromOrders } from "../../Cron/Methods/Orders.cron.methods";
import Logger from "../../Lib/Logger";

export default
{
    name: 'Cron',
    description: 'Show all cron jobs',
    args: [
        {
            name: 'crons',
            type: "checkbox",
            message: "Select the cron you want to run",
            choices: [
                {
                    name: 'Invoice notify',
                    value: 'run_invoices_notify',
                },
                {
                    name: 'Charge payments',
                    value: 'run_charge_payment',
                },
                {
                    name: 'Invoice late notify',
                    value: 'run_late_invoice_notify',
                },
                {
                    name: "Create invoice from order",
                    value: 'run_create_invoice_from_order',
                }
            ],
        }
    ],
    method: async ({crons}: {crons: string[]}) => 
    {
        if (crons.includes('run_invoices_notify'))
        {
            Logger.info('Running Invoice notify');
            cron_notifyInvoices();
        }
        if (crons.includes('run_charge_payment'))
        {
            Logger.info('Running Charge payments');
            cron_chargeStripePayment();
        }
        if (crons.includes('run_late_invoice_notify'))
        {
            Logger.info('Running Invoice late notify');
            cron_notifyLateInvoicePaid()
        }
        if (crons.includes('run_create_invoice_from_order'))
        {
            Logger.info('Running Create invoice from order');
            cron_createNewInvoicesFromOrders();
        }
        return true;
    }
}