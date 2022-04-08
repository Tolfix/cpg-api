/* eslint-disable no-case-declarations */
import InvoiceModel from "../../Database/Models/Invoices.model";
import Logger from "../../Lib/Logger";
import inquirer from 'inquirer';
import TransactionsModel from "../../Database/Models/Transactions.model";
import { Company_Currency } from "../../Config";
import { getDate } from "../../Lib/Time";
import { idTransactions } from "../../Lib/Generator";
import sendEmailOnTransactionCreation from "../../Lib/Transaction/SendEmailOnCreation";
import { getDates30DaysAgo } from "../../Cron/Methods/Invoices.cron.methods";

export default
{
    name: 'Invoices',
    description: 'Get all invoice jobs',
    args: [
        {
            name: 'action',
            type: "list",
            message: "Select the cron you want to run",
            choices: [
                {
                    name: 'Get Invoices',
                    value: 'get_invoices',
                },
                {
                    name: 'Get invoice',
                    value: 'get_invoice',
                },
                {
                    name: 'Get late invoices',
                    value: 'get_late_invoices',
                },
                {
                    name: 'Mark invoice as paid',
                    value: 'mark_invoice_paid',
                }
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch(action)
        {
            case 'get_invoices':
                // Getting all invoices
                Logger.info(`All invoices:`, await InvoiceModel.find());
                break; 

            case 'get_invoice':
                const action = [
                    {
                        name: 'invoiceId',
                        type: 'input',
                        message: 'Enter the invoice id/ocr',
                    },
                    {
                        name: 'isOCR',
                        type: 'confirm',
                        message: 'Is this an ocr number?',
                        
                    }
                ]
                const { invoiceId, isOCR } = await inquirer.prompt(action);
                let id = invoiceId;
                if(isOCR)
                    // get id from ocr, by removing the last 8 digits in the start 
                    id = invoiceId.substring(0, invoiceId.length - 8);

                Logger.info(`Invoice:`, await InvoiceModel.findOne({
                    id: id,
                }));
                break;
            case 'get_late_invoices':
                {
                    const invoices = await InvoiceModel.find({
                        "dates.due_date": {
                            $in: [...(getDates30DaysAgo())]
                        },
                        paid: false,
                        status: {
                            $not: /fraud|cancelled|draft|refunded/g
                        }
                    });
                    Logger.info(`Total late invoices:`, invoices.length);
                    Logger.info(`Late invoices ids:`, invoices.map(e => e.id));
                    break;
                }
            case 'mark_invoice_paid':
                {
                    const action = [
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
                    ]
                    const { invoiceId, cTransaction } = await inquirer.prompt(action);
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
        return true;
    }
}