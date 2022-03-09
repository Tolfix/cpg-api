import stripe from "stripe";
import { Company_Currency, DebugMode, Full_Domain, Stripe_SK_Live, Stripe_SK_Test } from "../Config";
import CustomerModel from "../Database/Models/Customers/Customer.model";
import InvoiceModel from "../Database/Models/Invoices.model";
import TransactionsModel from "../Database/Models/Transactions.model";
import { sendEmail } from "../Email/Send";
import NewTransactionTemplate from "../Email/Templates/Transaction/NewTransaction.template";
import { ICustomer } from "../Interfaces/Customer.interface";
import { IInvoice } from "../Interfaces/Invoice.interface";
import getFullName from "../Lib/Customers/getFullName";
import { idTransicitons } from "../Lib/Generator";
import { getInvoiceByIdAndMarkAsPaid } from "../Lib/Invoices/MarkAsPaid";
import Logger from "../Lib/Logger";
import { getDate } from "../Lib/Time";
import sendEmailOnTransactionCreation from "../Lib/Transaction/SendEmailOnCreation";
const Stripe = new stripe(DebugMode ? Stripe_SK_Test : Stripe_SK_Live, {
    apiVersion: "2020-08-27",
});

// Check if stripe webhook is configured
(async () => 
{
    if(!((await Stripe.webhookEndpoints.list()).data.length))
        Stripe.webhookEndpoints.create({
            url: `${Full_Domain}/v2/payments/stripe/webhook`,
            enabled_events: [
                "payment_intent.succeeded",
                "payment_intent.payment_failed",
                // "payment_method.attached",
                "payment_method.updated",
                "payment_method.detached",
                "setup_intent.succeeded",
                "setup_intent.canceled",
            ],
        });
})();



const cacheIntents = new Map<string, stripe.Response<stripe.PaymentIntent>>();
const cacheSetupIntents = new Map<string, stripe.Response<stripe.SetupIntent>>();

// Create a method that will create a payment intent from an order
export const CreatePaymentIntent = async (invoice: IInvoice) =>
{
    if(cacheIntents.has(invoice.uid))
        return cacheIntents.get(invoice.uid) as stripe.Response<stripe.PaymentIntent>;

    const customer = await CustomerModel.findOne({ id: invoice.customer_uid });
    if(!customer)
        throw new Error("Customer not found");
    // Check if we got this customer on stripe
    let s_customer;

    if(customer.extra?.stripe_id)
        s_customer = await Stripe.customers.retrieve(customer.extra.stripe_id);

    if(!customer.extra?.stripe_id)
        // Create the customer on stripe
        s_customer = await Stripe.customers.create({
            email: customer.personal.email,
            name: getFullName(customer),
            phone: customer.personal.phone,
            metadata: {
                customer_id: customer.id,
                customer_uid: customer.uid,
            },
        });

    if(!customer.extra)
        customer.extra = {};

    customer.extra.stripe_id = s_customer?.id;
    customer.markModified("extra");
    await customer.save();

    const intent = (await Stripe.paymentIntents.create({
        customer: s_customer?.id,
        amount: (invoice.amount+invoice.amount*invoice.tax_rate/100) * 100,
        currency: (!customer.currency ? await Company_Currency() : customer.currency) ?? "sek",
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

export const createSetupIntent = async (id: ICustomer["id"]) =>
{
    if(cacheSetupIntents.has(id))
        return cacheSetupIntents.get(id) as stripe.Response<stripe.SetupIntent>;

    const customer = await CustomerModel.findOne({ id: id });
    if(!customer)
        throw new Error("Customer not found");
    
    // Check if we got this customer on stripe
    let s_customer;

    if(customer.extra?.stripe_id)
        s_customer = await Stripe.customers.retrieve(customer.extra.stripe_id);

    if(!customer.extra?.stripe_id)
        // Create the customer on stripe
        s_customer = await Stripe.customers.create({
            email: customer.personal.email,
            name: getFullName(customer),
            phone: customer.personal.phone,
            metadata: {
                customer_id: customer.id,
                customer_uid: customer.uid,
            },
        });

    if(!customer.extra)
        customer.extra = {};

    customer.extra.stripe_id = s_customer?.id;
    customer.markModified("extra");
    await customer.save();

    // Check if already have a setup intent
    if(customer.extra.stripe_setup_intent)
        throw new Error("Setup intent already exists");

    const setupIntent = await Stripe.setupIntents.create({
        customer: s_customer?.id,
        payment_method_types: ['card'],
        metadata: {
            customer_id: customer.id,
            customer_uid: customer.uid,
        },
    });

    cacheSetupIntents.set(id, setupIntent);

    return setupIntent;
};

export const RetriveSetupIntent = async (setup_intent: string) => (await Stripe.setupIntents.retrieve(setup_intent));

export const ChargeCustomer = async (invoice_id: IInvoice["id"]) =>
{
    const invoice = await InvoiceModel.findOne({ id: invoice_id });
    if(!invoice)
        throw new Error("Invoice not found");

    const customer = await CustomerModel.findOne({ id: invoice.customer_uid });
    if(!customer)
        throw new Error("Customer not found");

    // Check if we got this customer on stripe
    const s_customer = await Stripe.customers.retrieve(customer.extra?.stripe_id  ?? "");
    if(!s_customer)
        throw new Error("Customer not found on stripe");
        
    const paymentMethods = await Stripe.paymentMethods.list({
        customer: s_customer.id,
        type: 'card',
    });

    try
    {
        const paymentIntent = await Stripe.paymentIntents.create({
            amount: (invoice.amount+invoice.amount*invoice.tax_rate/100) * 100,
            currency: (!customer.currency ? await Company_Currency() : customer.currency) ?? "sek",
            payment_method_types: ["card"],
            receipt_email: customer?.personal.email,
            // @ts-ignore
            description: "Invoice #" + invoice.id,
            metadata: {
                // @ts-ignore
                invoice_id: invoice.id,
                invoice_uid: invoice.uid,
            },
            customer: s_customer.id,
            payment_method: paymentMethods.data.length ? paymentMethods.data[0].id : undefined,
            off_session: true,
            confirm: true,
        });

        // Create transaction
        const newTrans = await (new TransactionsModel({
            amount: invoice.amount+invoice.amount*invoice.tax_rate/100,
            payment_method: invoice.payment_method,
            fees: 0,
            invoice_uid: invoice.id,
            customer_uid: invoice.customer_uid,
            currency: invoice.currency ?? await Company_Currency(),
            date: getDate(),
            uid: idTransicitons(),
        }).save());

        // await sendEmail(customer.personal.email, "Transaction Statement", {
        //     isHTML: true,
        //     body: await NewTransactionTemplate(t, customer),
        // });

        await sendEmail({
            reciever: customer.personal.email,
            subject: "Transaction Statement",
            body: {
                body: await NewTransactionTemplate(newTrans, customer, true)
            },
        })

        Logger.warning(`Created transaction ${newTrans.uid} for invoice ${invoice.id}`);

        invoice?.transactions.push(newTrans.id);

        invoice.markModified("transactions");
        await invoice.save();

        return Promise.resolve(paymentIntent);
    }
    catch(e)
    {
        Promise.reject(e);
    }
}

export const markInvoicePaid = async (intent: stripe.Response<stripe.PaymentIntent>) =>
{
    const invoice = await getInvoiceByIdAndMarkAsPaid(intent.metadata.invoice_id);

    const newTrans = await (new TransactionsModel({
        amount: invoice.amount+invoice.amount*invoice.tax_rate/100,
        payment_method: invoice.payment_method,
        fees: 0,
        invoice_uid: invoice.id,
        customer_uid: invoice.customer_uid,
        currency: invoice.currency ?? await Company_Currency(),
        date: getDate(),
        uid: idTransicitons(),
    }).save());

    await sendEmailOnTransactionCreation(newTrans);

    invoice?.transactions.push(newTrans.id);

    await invoice.save();
}