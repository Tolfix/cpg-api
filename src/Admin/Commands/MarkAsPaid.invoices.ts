import { Company_Currency } from "../../Config";
import InvoiceModel from "../../Database/Models/Invoices.model";
import TransactionsModel from "../../Database/Models/Transactions.model";
import { idTransactions } from "../../Lib/Generator";
import Logger from "../../Lib/Logger";
import { getDate } from "../../Lib/Time";
import sendEmailOnTransactionCreation from "../../Lib/Transaction/SendEmailOnCreation";

export default {
    name: 'markAsPaid',
    description: 'Mark an invoice as paid',
    args: [
        {
            name: 'invoiceId',
            type: 'input',
            message: 'Enter the invoice id',
            validate: (value: string) =>
            {
                if (isNaN(Number(value)))
                    return 'Please enter a valid number';
                return true;
            },
        },
        {
            name: 'cTransaction',
            type: 'input',
            message: 'Create transaction? (yes/no)',
            default: 'yes',
            validate: (value: string) =>
            {
                if (value.toLowerCase() !== 'yes' && value.toLowerCase() !== 'no')
                    return 'Please enter yes or no';
                return true;
            },
        }
    ],
    method: async ({
        invoiceId,
        cTransaction,
    }: {
        invoiceId: string;
        cTransaction: string;
    }) =>
    {
        const invoice = await InvoiceModel.findOne({
            id: invoiceId,
        });
        if (!invoice)
            return Logger.error(`Invoice with id ${invoiceId} not found`);
        if (invoice.paid)
            return Logger.error(`Invoice with id ${invoiceId} is already paid`);

        if(cTransaction.toLowerCase() === 'yes')
        {
            const t = await (new TransactionsModel({
                amount: invoice.amount+invoice.amount*invoice.tax_rate/100,
                payment_method: invoice.payment_method,
                fees: 0,
                invoice_uid: invoice.id,
                customer_uid: invoice.customer_uid,
                currency: invoice.currency ?? await Company_Currency(),
                date: getDate(),
                uid: idTransactions(),
            }).save());

            await sendEmailOnTransactionCreation(t);
            invoice.transactions.push(t.id);

        }

        invoice.paid = true;

        await invoice.save();
        Logger.info(`Invoice with id ${invoiceId} marked as paid`);
    }
}