import stripe from "stripe";
import { Company_Currency, DebugMode, Stripe_SK_Live, Stripe_SK_Test } from "../Config";
import CustomerModel from "../Database/Models/Customers/Customer";
import TransactionsModel from "../Database/Models/Transactions";
import { IInvoice } from "../Interfaces/Invoice";
import { idTransicitons } from "../Lib/Generator";
import { getInvoiceByIdAndMarkAsPaid } from "../Lib/Invoices/MarkAsPaid";
import { getDate } from "../Lib/Time";
const Stripe = new stripe(DebugMode ? Stripe_SK_Test : Stripe_SK_Live, {
    apiVersion: "2020-08-27",
});

const cacheIntents = new Map<string, stripe.Response<stripe.PaymentIntent>>();

// Create a method that will create a payment intent from an order
export const CreatePaymentIntent = async (invoice: IInvoice) =>
{
    if(cacheIntents.has(invoice.uid))
        return cacheIntents.get(invoice.uid) as stripe.Response<stripe.PaymentIntent>;

    const customer = await CustomerModel.findOne({ id: invoice.customer_uid });

    let intent = (await Stripe.paymentIntents.create({
        amount: (invoice.amount+invoice.amount*invoice.tax_rate/100) * 100,
        currency: Company_Currency ?? "sek",
        payment_method_types: ["card"],
        receipt_email: customer?.personal.email,
        // @ts-ignore
        description: "Invoice #" + invoice.id,
        metadata: {
            // @ts-ignore
            invoice_id: invoice.id,
            invoice_uid: invoice.uid,
        },
    }));

    cacheIntents.set(invoice.uid, intent);

    return intent;
};

export const RetrivePaymentIntent = async (payment_intent: string) => (await Stripe.paymentIntents.retrieve(payment_intent));

export const markInvoicePaid = async (intent: stripe.Response<stripe.PaymentIntent>) =>
{
    const invoice = await getInvoiceByIdAndMarkAsPaid(intent.metadata.invoice_id);

    const newTrans = await (new TransactionsModel({
        amount: invoice.amount+invoice.amount*invoice.tax_rate/100,
        payment_method: invoice.payment_method,
        fees: 0,
        invoice_uid: invoice.id,
        customer_uid: invoice.customer_uid,
        date: getDate(),
        uid: idTransicitons(),
    }).save());

    invoice?.transactions.push(newTrans.id);

    await invoice.save();
}