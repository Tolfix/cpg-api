import { stripIndents } from "common-tags";
import { CPG_Customer_Panel_Domain, Full_Domain } from "../../../Config";
import { ICustomer } from "@interface/Customer.interface";
import { IInvoice, IInvoiceMethods } from "@interface/Invoice.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";
import printInvoiceItemsTable from "../Methods/InvoiceItems.print";

export default async (invoice: IInvoice & IInvoiceMethods, customer: ICustomer) => await UseStyles(stripIndents`
<div>
    <h1>Hello ${getFullName(customer)}.</h1>
    <p>
        This is a notice that an invoice has been generated on <strong>${invoice.dates.invoice_date}</strong>.
    </p>
    <p>
        <strong>Invoice number:</strong> ${invoice.id}
    </p>
    <p>
        <strong>OCR number:</strong> ${(invoice.dates.invoice_date as string).replaceAll("-", "")}${invoice.id}
    </p>
    <p>
        <strong>Your payment method is:</strong> ${(invoice.payment_method).firstLetterUpperCase().replaceAll("_", " ")}
    </p>
    <p>
        <strong>Tax due:</strong> ${invoice.tax_rate}%
    </p>
    <p>
        <strong>Amount due:</strong> ${invoice.getTotalAmount({ tax: false, currency: true, symbol: true })}
    </p>
    <p>
        <strong>Due date:</strong> ${invoice.dates.due_date}
    </p>
    <p>
        ${invoice.payment_method === "paypal" ? `<br />
        <a href="${Full_Domain}/v2/paypal/pay/${invoice.uid}" target="_blank">
            Click me to pay.
        </a>
        ` : ''}
        ${invoice.payment_method === "credit_card" ? `
        <a href="${Full_Domain}/v2/stripe/pay/${invoice.uid}" target="_blank">
            Click me to pay.
        </a>
        <p>
            ${customer?.extra?.stripe_setup_intent ? 
            `
                <strong>
                    You already have a payment method setup. <br />
                    You'll be automatically pay when a invoice is 14 days ahead. <br />
                </strong>
            ` 
            : 
            
            `
                <strong>
                    To pay automatic invoice, you need to setup your payment method. It will automatic pay when a invoice is 14 days ahead. <br />
                    <a href="${Full_Domain}/v2/stripe/setup/${customer.uid}" target="_blank">
                        Click here to setup your payment method.
                    </a>
                </strong>
            `}

        </p>
        ` : ''}
    </p>

    ${await printInvoiceItemsTable(invoice)}

    <p>
        <strong>
            Total:
        </strong>
        ${invoice.getTotalAmount({ tax: true, currency: true, symbol: true })} (${invoice.tax_rate}%)
    </p>
    <p>
        <strong>
            Thank you for your business.
        </strong>
    </p>
    ${CPG_Customer_Panel_Domain ? `
    <p>
        <a href="${CPG_Customer_Panel_Domain}/invoices/${invoice.id}">View Invoice</a>
    </p>
    ` : ''}
</div>
`);