/* eslint-disable no-case-declarations */
import InvoiceModel from "../../Database/Models/Invoices.model";
import Logger from "../../Lib/Logger";
import inquirer from 'inquirer';
import TransactionsModel from "../../Database/Models/Transactions.model";
import { Company_Currency } from "../../Config";
import { getDate } from "../../Lib/Time";
import { idInvoice, idTransactions } from "../../Lib/Generator";
import sendEmailOnTransactionCreation from "../../Lib/Transaction/SendEmailOnCreation";
import { getDates30DaysAgo } from "../../Cron/Methods/Invoices.cron.methods";
import { A_CC_Payments } from "../../Types/PaymentMethod";
import { currencyCodes } from "../../Lib/Currencies";
import CustomerModel from "../../Database/Models/Customers/Customer.model";
import mainEvent from "../../Events/Main.event";
import { sendInvoiceEmail } from "../../Lib/Invoices/SendEmail";
import { IInvoice } from "@interface/Invoice.interface";

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
                    name: "Delete invoice",
                    value: "delete_invoice",
                },
                {
                    name: 'Get late invoices',
                    value: 'get_late_invoices',
                },
                {
                    name: 'Mark invoice as paid',
                    value: 'mark_invoice_paid',
                },
                {
                    name: 'Create invoice',
                    value: 'create_invoice',
                }
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch (action)
        {
            case 'get_invoices':
                // Getting all invoices
                const invoices = (await InvoiceModel.find()).map(invoice =>
                {
                    return {
                        id: invoice.id,
                        customer: invoice.customer_uid,
                        amount: invoice.amount,
                        currency: invoice.currency,
                        due_date: invoice.dates?.due_date,
                        invoice_date: invoice.dates?.invoice_date,
                        notified: invoice.notified,
                        paid: invoice.paid,
                        status: invoice.status,
                    }
                });
                console.table(invoices);
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
                if (isOCR)
                    // get id from ocr, by removing first 8 characters
                    id = invoiceId.substring(8);

                Logger.info(`Invoice:`, await InvoiceModel.findOne({
                    id: id,
                }));
                break;

            case 'delete_invoice':
                {
                    const action = [
                        {
                            name: 'invoiceId',
                            type: 'search-list',
                            message: 'Select the invoice you want to delete',
                            choices: (await InvoiceModel.find()).map(invoice =>
                            {
                                return {
                                    name: `#${invoice.id}`,
                                    value: invoice.id,
                                }
                            }),
                        },
                    ];
                    const { invoiceId } = await inquirer.prompt(action);
                    await InvoiceModel.deleteOne({
                        id: invoiceId,
                    });
                    Logger.info(`Invoice deleted`, invoiceId);
                    break;                    
                }
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
            
                    if (cTransaction.toLowerCase() === 'yes')
                    {
                        const t = await (new TransactionsModel({
                            amount: invoice.amount+invoice.amount*invoice.tax_rate/100,
                            payment_method: invoice.payment_method,
                            fees: invoice.fees,
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
                    invoice.dates.date_paid = getDate();
                    invoice.markModified('dates');
                    await invoice.save();
                    mainEvent.emit("invoice_paid", invoice);
                    Logger.info(`Invoice with id ${invoiceId} marked as paid`);
                    break;
                }
            case 'create_invoice':
                {
                    const action = [
                        {
                            name: 'customerId',
                            type: 'search-list',
                            message: 'Customer',
                            choices: (await CustomerModel.find()).map(e =>
                                {
                                    return {
                                        name: `${e.personal.first_name} ${e.personal.last_name} (${e.id})`,
                                        value: e.id,
                                    }
                                })
                        },
                        {
                            name: 'invoice_date',
                            type: 'input',
                            message: 'Enter the invoiced date',
                        },
                        {
                            name: 'due_date',
                            type: 'input',
                            message: 'Enter the due date',
                        },
                        {
                            name: 'amount',
                            type: 'number',
                            message: 'Enter the amount',
                        },
                        {
                            name: 'tax_rate',
                            type: 'number',
                            message: 'Enter the tax rate',
                        },
                        {
                            name: 'payment_method',
                            type: 'search-list',
                            message: 'Enter the payment method',
                            choices: A_CC_Payments
                        },
                        {
                            name: 'currency',
                            type: 'search-list',
                            message: 'Enter the currency',
                            choices: currencyCodes
                        },
                        {
                            name: 'notes',
                            type: 'input',
                            message: 'Enter the notes',
                        },
                        {
                            name: "items",
                            type: "input",
                            message: "Enter the items (separated by ';') (name,quantity,price;...)",
                            response: 'array',
                            validate: (value: string) =>
                            {
                                if (value.split(';').length < 1)
                                    return 'Please enter at least one item';
                                return true;
                            }
                        },
                        {
                            name: 'fees',
                            type: 'number',
                            message: 'Enter the fees',
                        },
                        {
                            name: "send_email",
                            type: "confirm",
                            message: "Send notification?",
                            default: true,
                        }
                    ]
                    const { customerId, invoice_date, due_date, amount, tax_rate, payment_method, currency, notes, items, send_email, fees } = await inquirer.prompt(action);
                    const customer = await CustomerModel.findOne({ id: customerId })
                    if (!customer)
                        return Logger.error(`Customer with id ${customerId} not found`);
                    // parse items
                    const nItems = (items as string).split(';').map((e: string) =>
                    {
                        if (e === "")
                            return null;
                        const [notes, quantity, price] = e.split(',');
                        if (!notes || !quantity || !price)
                            null;
                        return {
                            notes,
                            quantity: Number(quantity),
                            amount: Number(price),
                        }
                    }).filter(e => e);
                
                    const invoice = await (new InvoiceModel({
                        customer_uid: customerId,
                        dates: {
                            invoice_date: invoice_date,
                            due_date: due_date,
                            date_refunded: null,
                            date_cancelled: null,
                            date_paid: null
                        },
                        amount,
                        tax_rate,
                        payment_method,
                        currency,
                        notes,
                        fees: parseInt(fees ?? '0'),
                        items: nItems as IInvoice['items'],
                        status: "active",
                        paid: false,
                        notified: false,
                        uid: idInvoice(),
                        transactions: [],
                    }).save());

                    Logger.info(`Invoice created with id ${invoice.id}`);
                    mainEvent.emit("invoice_created", invoice);
                    if (send_email)
                        await sendInvoiceEmail(invoice, customer);

                    break;
                }
        }
        return true;
    }
}