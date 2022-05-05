import TransactionsModel from "../../Database/Models/Transactions.model";
import Logger from "../../Lib/Logger";
import inquirer from 'inquirer';
import CustomerModel from "../../Database/Models/Customers/Customer.model";
import InvoiceModel from "../../Database/Models/Invoices.model";
import { A_CC_Payments } from "../../Types/PaymentMethod";
import { currencyCodes } from "../../Lib/Currencies";
import dateFormat from "date-and-time";
import mainEvent from "../../Events/Main.event";

export default
{
    name: 'Transactions',
    description: 'Get all transactions jobs',
    args: [
        {
            name: 'action',
            type: "list",
            message: "Select the transaction job you want to run",
            choices: [
                {
                    name: 'Show transactions',
                    value: 'show_transactions',
                },
                {
                    name: 'Add transaction',
                    value: 'add_transaction',
                },
                {
                    name: 'Delete transaction',
                    value: 'delete_transaction',
                }
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch (action)
        {
            case 'show_transactions':
                {
                    const transaction = await TransactionsModel.find();
                    Logger.info(`Transactions:`, transaction);
                    break;
                }
            case 'add_transaction':
                {
                    const action1 = [
                        {
                            name: "statement",
                            type: "list",
                            message: "Select the transaction statement",
                            choices: [
                                {
                                    name: "Income",
                                    value: "income",
                                },
                                {
                                    name: "Expense",
                                    value: "expense",
                                }
                            ],
                        }
                    ]

                    const {statement} = await inquirer.prompt(action1);
                    const income_action = [
                        {
                            name: "customer_uid",
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
                            name: "invoice_uid",
                            type: 'search-list',
                            message: 'Invoice',
                            choices: (await InvoiceModel.find()).map(e =>
                                {
                                    return {
                                        name: `#${e.id} (${e.amount} ${e.currency})`,
                                        value: e.id,
                                    }
                                })
                        },
                        {
                            name: "amount",
                            type: 'number',
                            message: 'Amount',

                        },
                        {
                            name: "fees",
                            type: 'number',
                            message: 'Fees',
                        },
                        {
                            name: "payment_method",
                            type: 'search-list',
                            message: 'Payment method',
                            choices: A_CC_Payments
                        },
                        {
                            name: 'currency',
                            type: 'search-list',
                            message: 'Enter the currency',
                            choices: currencyCodes
                        },
                        {
                            name: 'date',
                            type: 'input',
                            message: 'Enter the date',
                            default: dateFormat.format(new Date(), 'YYYY-MM-DD'),
                        }
                    ];
                    const expense_action = [
                        {
                            name: "invoice_id",
                            type: 'input',
                            message: 'Invoice ID',
                        },
                        {
                            name: "company",
                            type: 'input',
                            message: 'Company',
                        },
                        {
                            name: "amount",
                            type: 'number',
                            message: 'Amount',

                        },
                        {
                            name: "fees",
                            type: 'number',
                            message: 'Fees',
                        },
                        {
                            name: "payment_method",
                            type: 'search-list',
                            message: 'Payment method',
                            choices: A_CC_Payments
                        },
                        {
                            name: 'currency',
                            type: 'search-list',
                            message: 'Enter the currency',
                            choices: currencyCodes
                        },
                        {
                            name: "description",
                            type: 'input',
                            message: 'Description',
                        },
                        {
                            name: "notes",
                            type: 'input',
                            message: 'Notes',
                        },
                        {
                            name: 'date',
                            type: 'input',
                            message: 'Enter the date',
                            default: dateFormat.format(new Date(), 'YYYY-MM-DD'),
                        },
                    ]

                    const picked_action = statement === 'income' ? income_action : expense_action;

                    const result = await inquirer.prompt(picked_action);

                    switch (statement)
                    {
                        case 'income':
                            {
                                const {customer_uid, invoice_uid, amount, fees, payment_method, currency, date} = result;
                                const transaction = await (new TransactionsModel({
                                    customer_uid,
                                    invoice_uid,
                                    amount,
                                    fees,
                                    payment_method,
                                    currency,
                                    date,
                                    statement: 'income',
                                })).save();
                                Logger.info(`Transaction:`, transaction);
                                mainEvent.emit('transaction_created', transaction);
                                break;
                            }
                        case 'expense':
                            {
                                const {invoice_id, company, amount, fees, payment_method, currency, date, description, notes} = result;
                                const transaction = await (new TransactionsModel({
                                    statement: 'expense',
                                    expense_information: {
                                        invoice_id,
                                        company,
                                        description,
                                        notes,
                                    },
                                    amount,
                                    fees,
                                    payment_method,
                                    currency,
                                    date,
                                })).save();
                                Logger.info(`Transaction:`, transaction);
                                mainEvent.emit('transaction_created', transaction);
                                break;
                            }
                    }
                    break;
                }
            case 'delete_transaction':
                {
                    const transaction = await TransactionsModel.find();
                    const action1 = [
                        {
                            name: "transaction_id",
                            type: "search-list",
                            message: "Select the transaction you want to delete",
                            choices: transaction.map(e =>
                                {
                                    return {
                                        name: `#${e.id} (${e.amount} ${e.currency})`,
                                        value: e.id,
                                    }
                                }
                            )
                        }
                    ]
                    const {transaction_id} = await inquirer.prompt(action1);
                    const transaction_to_delete = await TransactionsModel.findOne({id: transaction_id});
                    if (!transaction_to_delete)
                        return Logger.error(`Transaction with id ${transaction_id} not found`);

                    await transaction_to_delete.remove();
                    Logger.info(`Transaction deleted:`, transaction_to_delete);
                    mainEvent.emit('transaction_deleted', transaction_to_delete);
                    
                    break;
                }
        }
        return true;
    }
}