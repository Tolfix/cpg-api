import { stripIndents } from "common-tags";
import { Company_Name, CPG_Customer_Panel_Domain } from "../../../Config";
import { ICustomer } from "@interface/Customer.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";
import { IQuotes } from "@interface/Quotes.interface";
import printQuotesItemsTable from "../Methods/QuotesItems.print";

export default async (quote: IQuotes, customer: ICustomer) => await UseStyles(stripIndents`
<div>
    <h1>Hello ${getFullName(customer)}.</h1>
    <p>
        This is a notice that <strong>${await Company_Name()}</strong> has sent a <strong>quote</strong> to you.
    </p>
    <p>
        <strong>Memo:</strong> ${quote.memo}
    </p>
    <p>
        <strong>Due Date:</strong> ${quote.due_date}
    </p>
    <p>
        <strong>Payment Method:</strong> ${quote.payment_method}
    </p>

    ${await printQuotesItemsTable(quote)}

    <p>
        <strong>
            Total:
        </strong>
        ${quote.items.reduce((total, item) => total + (item.price * item.quantity), 0) + ((quote.tax_rate/100) * quote.items.reduce((total, item) => total + (item.price * item.quantity), 0))}
    </p>
    ${CPG_Customer_Panel_Domain ? `
    <p>
        <a href="${CPG_Customer_Panel_Domain}/quotes/${quote.id}">View quote</a> to accept or decline.
    </p>
    ` : ''}
</div>
`);