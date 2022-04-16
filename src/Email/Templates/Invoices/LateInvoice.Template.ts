import { stripIndents } from "common-tags";
import { CPG_Customer_Panel_Domain, Full_Domain, Swish_Payee_Number } from "../../../Config";
import { ICustomer } from "@interface/Customer.interface";
import { IInvoice, IInvoiceMethods } from "@interface/Invoice.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";
import printInvoiceItemsTable from "../Methods/InvoiceItems.print";
import { createSwishQRCode } from "../../../Payments/Swish";
import { convertCurrency } from "../../../Lib/Currencies";
import GetOCRNumber from "../../../Lib/Invoices/GetOCRNumber";

export default async (invoice: IInvoice & IInvoiceMethods, customer: ICustomer) => await UseStyles(stripIndents`
<div>
    <h1>Hello ${getFullName(customer)}.</h1>
    <p>
        This is a notice that invoice ${invoice.id} is late.
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
        <strong>Amount due:</strong> ${invoice.getTotalAmount({ tax: false, currency: false, symbol: false }).toFixed(2)} ${(invoice.currency)}
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
        ${((
            customer.billing.country.toLocaleLowerCase() === "sweden"
            ||
            customer.billing.country.toLocaleLowerCase() === "sverige"
            ) && (Swish_Payee_Number && customer.personal.phone) && (invoice.payment_method === "swish")) ? `
            <img 
                src="data:image/png;base64,${await createSwishQRCode(Swish_Payee_Number,
                    await convertCurrency((invoice.amount)+(invoice.amount)*(invoice.tax_rate/100), invoice.currency, "SEK"),
                    `OCR ${GetOCRNumber(invoice)}`)}" 
            width="150">
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
                    Money will be automatically removed from your account when an invoice is 14 days ahead. <br />
                </strong>
            ` 
            : 
            
            `
                <strong>
                    To pay using the automatic invoice, you will need to set up your payment method. <br/> It will automatically pay when an invoice is 14 days ahead. <br />
                    <a href="${Full_Domain}/v2/stripe/setup/${customer.uid}" target="_blank">
                        Click here to set up your payment method.
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
        ${invoice.getTotalAmount({ tax: true, currency: false, symbol: false }).toFixed(2)} ${invoice.currency} (${invoice.tax_rate}%)
    </p>
    <p>
        <strong>
            Thank you for your business.
        </strong>
    </p>
    ${CPG_Customer_Panel_Domain ? `
    <p>
        <a href="${CPG_Customer_Panel_Domain}/invoices?id=${invoice.id}">View Invoice</a>
    </p>
    ` : ''}
</div>
`);