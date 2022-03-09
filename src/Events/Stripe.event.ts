import stripe from "stripe";
import CustomerModel from "../Database/Models/Customers/Customer.model";
import InvoiceModel from "../Database/Models/Invoices.model";
import { sendEmail } from "../Email/Send";
import PaymentFailedTemplate from "../Email/Templates/Payments/PaymentFailed.template";
import { markInvoicePaid, RetrivePaymentIntent } from "../Payments/Stripe";

export default async function stripeWebhookEvent(event: stripe.Event)
{
    switch (event.type)
    {
        case 'payment_intent.succeeded': {
            const payment_intent = event.data.object as any;
            const intent = await RetrivePaymentIntent(payment_intent.id);
            markInvoicePaid(intent);
            break;
        }

        case 'payment_intent.payment_failed': {
            const payment_intent = event.data.object as any;
            const intent = await RetrivePaymentIntent(payment_intent.id);
            // Send email to customer
            // That their payment failed
            const invoice_id = intent.metadata.invoice_id;
            const invoice = await InvoiceModel.findOne({ id: invoice_id });
            if(!invoice)
                throw new Error("Invoice not found");

            const customer = await CustomerModel.findOne({ $or: [
                { id: invoice.customer_uid },
                { uid: invoice.customer_uid },
            ] });
            if(!customer)
                throw new Error("Customer not found");

            // Send email to customer
            // That their payment failed
            sendEmail({
                reciever: customer.personal.email,
                subject: `Payment failed for invoice ${invoice.id}`,
                body: {
                    body: await PaymentFailedTemplate(invoice, customer),
                }
            });
            break;
        }

        // TODO add more events

    }
}