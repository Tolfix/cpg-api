import { IInvoice } from "@interface/Invoice.interface";
import { stripIndents } from "common-tags";
import { Company_Email, CPG_Customer_Panel_Domain } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import { GetCurrencySymbol } from "../../../Types/PaymentTypes";
import UseStyles from "../General/UseStyles";
import printInvoiceItemsTable from "../Methods/InvoiceItems.print";

export = async (invoice: IInvoice, customer: ICustomer) => UseStyles(stripIndents`
<div>
    <h1>
        Hello, ${getFullName(customer)} <br />
        You're payment for invoice <strong>#${invoice.id}</strong> failed.
    </h1>
    <p>
        ${invoice.payment_method === 'credit_card' ? `
            Ensure that your card details are correct and try again.
        ` : ''}
        ${invoice.payment_method === 'paypal' ? `
            Ensure that your PayPal account is correct and try again.
        ` : ''}
        <br />
        If you have any questions, please contact us at ${await Company_Email()}
    </p>
    <p>
        Items: <br />
        ${printInvoiceItemsTable(invoice)}
    </p>
    <p>
        <strong>
            Total:
        </strong>
        ${invoice.amount+invoice.amount*invoice.tax_rate/100} ${GetCurrencySymbol(invoice.currency)} (${invoice.tax_rate}%)
    </p>
    <p>
        <strong>
            Thank you for your business.
        </strong>
    </p>
    ${CPG_Customer_Panel_Domain ? `
    
        <p>
            <a href="${CPG_Customer_Panel_Domain}/invoices/${invoice.uid}">View invoice</a>
        </p>

    ` : ''}
</div>
`);