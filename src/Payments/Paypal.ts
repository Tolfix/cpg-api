import paypal from "paypal-rest-sdk";
import { Company_Currency, DebugMode, Domain, Http_Schema, Paypal_Client_Id, Paypal_Client_Secret, PORT } from "../Config";
import TransactionsModel from "../Database/Models/Transactions";
import { IInvoice } from "../Interfaces/Invoice";
import { idTransicitons } from "../Lib/Generator";
import { getInvoiceByIdAndMarkAsPaid } from "../Lib/Invoices/MarkAsPaid";
import Logger from "../Lib/Logger";
import { getDate } from "../Lib/Time";

if(Paypal_Client_Id !== "" || Paypal_Client_Secret !== "")
    paypal.configure({
        'mode': DebugMode ? 'sandbox' : "live",
        'client_id': Paypal_Client_Id,
        'client_secret': Paypal_Client_Secret
    });

export async function createPaypalPaymentFromInvoice(invoice: IInvoice): Promise<paypal.Link[] | undefined>
{
    return new Promise(async (resolve, reject) => {

        function removeTags(str: string)
        {
            if ((str===null) || (str===''))
                return false;
            else
                str = str.toString();
                  
            // Regular expression to identify HTML tags in 
            // the input string. Replacing the identified 
            // HTML tag with a null string.
            return str.replace( /(<([^>]+)>)/ig, '');
        }

        Logger.warning(`Creating payment paypal for invoice ${invoice.uid}`);

        const create_payment_json =
        {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${Http_Schema}://${Domain === "localhost" ? `localhost:${PORT}` : Domain}/v2/paypal/success`,
                "cancel_url": `${Http_Schema}://${Domain === "localhost" ? `localhost:${PORT}` : Domain}/v2/paypal/cancel`
            },
            transactions: [
                {
                    item_list: {
                        items: invoice.items.map((item) => {
                            return {
                                name: removeTags(item.notes),
                                price: (item.amount+(item.amount*invoice.tax_rate/100)).toString(),
                                currency: Company_Currency.toUpperCase(),
                                quantity: item.quantity
                            }
                        })
                    },
                    amount: {
                        currency: Company_Currency.toUpperCase(),
                        total: (invoice.amount+(invoice.amount*invoice.tax_rate/100)).toString(),
                        details: {
                            subtotal: (invoice.amount+(invoice.amount*invoice.tax_rate/100)).toString(),
                            tax: "0",
                        }
                    },
                    description: `Invoice ${invoice.id}`,
                    invoice_number: invoice.id.toString(),
                }
            ]
        };

        // @ts-ignore
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error || !payment)
                throw error;

            Logger.warning(`Created payment paypal for invoice ${invoice.uid}`);

            resolve(payment?.links)
        });
    })
}

export async function retrievePaypalTransaction(payerId: string, paymentId: string)
{
    const execute_payment_json = {
        "payer_id": payerId,
    };
    
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) =>
    {
        if(error)
            return;

        if(payment.state !== "approved")
            return;

        // Go through each transactions and get invoice_number and mark the invoice as paid
        // then make a transaction and add it to the invoice
        for await(const tran of payment.transactions)
        {
            const invoice_number = tran.invoice_number;
            if(!invoice_number)
                return;
            const invoice = await getInvoiceByIdAndMarkAsPaid(invoice_number);
            const newTrans = await (new TransactionsModel({
                amount: invoice.amount+invoice.amount*invoice.tax_rate/100,
                payment_method: invoice.payment_method,
                fees: 0,
                invoice_uid: invoice.id,
                customer_uid: invoice.customer_uid,
                date: getDate(),
                uid: idTransicitons(),
            }).save());

            Logger.warning(`Created transaction ${newTrans.uid} for invoice ${invoice.uid}`);

            invoice?.transactions.push(newTrans.id);

            await invoice.save();
        }
    });
}