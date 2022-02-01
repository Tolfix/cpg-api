import { ICustomer, IInvoice } from "@ts/interfaces";
import { stripIndents } from "common-tags";
import { Company_Currency, Full_Domain } from "../../../Config";
import getFullName from "../../../Lib/Customers/getFullName";
import GetTableStyle from "../CSS/GetTableStyle";
import UseStyles from "../General/UseStyles";

export default async (invoice: IInvoice, customer: ICustomer) => await UseStyles(stripIndents`
<div>
    <h1>Hello ${getFullName(customer)}${customer.billing.company ? ` (${customer.billing.company})` : ''}.</h1>
    <p>
        This is a notice that an invoice has been generated on ${invoice.dates.invoice_date}.
    </p>
    <p>
        Invoice number: ${invoice.id}
    </p>
    <p>
        OCR number: ${(invoice.dates.invoice_date as string).replaceAll("-", "")}${invoice.id}
    </p>
    <p>
        Your payment method is: ${(invoice.payment_method).firstLetterUpperCase().replaceAll("_", " ")}
    </p>
    <p>
        Tax due: ${invoice.tax_rate}%
    </p>
    <p>
        Amount due: ${invoice.amount+invoice.amount*invoice.tax_rate/100}
    </p>
    <p>
        Due date: ${invoice.dates.due_date}
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
            <strong>
                To pay automatic invoice, you need to setup your payment method. It will automatic pay when a invoice is 14 days ahead. <br />
                <a href="${Full_Domain}/v2/stripe/setup/${customer.uid}" target="_blank">
                    Click here to setup your payment method.
                </a>
            </strong>
        </p>
        ` : ''}
    </p>

    <table style="${GetTableStyle}">
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            ${(await Promise.all(invoice.items.map(async item => `
                <tr>
                    <td>${item.notes}</td>
                    <td>${item.quantity}</td>
                    <td>${item.amount} ${await Company_Currency()}</td>
                </tr>
            `))).join('')}
        </tbody>
    </table>
    <p>
        <strong>
            Total:
        </strong>
        ${invoice.amount+invoice.amount*invoice.tax_rate/100} ${await Company_Currency()} (${invoice.tax_rate}%)
    </p>
    <p>
        <strong>
            Thank you for your business.
        </strong>
    </p>
</div>
`);