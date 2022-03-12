import { stripIndents } from "common-tags";
import { CPG_Customer_Panel_Domain } from "../../../Config";
import { ICustomer } from "@interface/Customer.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";
import { IQuotes } from "@interface/Quotes.interface";

export default async (quote: IQuotes, customer: ICustomer) => await UseStyles(stripIndents`
<div>
    <h1>Hello ${getFullName(customer)}.</h1>
    <p>
        This is a notice that quote <strong>#${quote.id}</strong> has been accepted.
    </p>
    <p>
        We will generate a invoice for you shortly.
    </p>
    ${CPG_Customer_Panel_Domain ? `
    <p>
        <a href="${CPG_Customer_Panel_Domain}/quotes?id=${quote.id}">View quote</a>.
    </p>
    ` : ''}
</div>
`);