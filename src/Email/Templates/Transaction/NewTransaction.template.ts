import { stripIndents } from "common-tags";
import { Company_Currency, Company_Email } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import { ITransactions } from "../../../Interfaces/Transactions.interface";
import PrintCompanyInformation from "../../../Lib/Company/PrintCompanyInformation";
import getFullName from "../../../Lib/Customers/getFullName";
import { GetCurrencySymbol, TPaymentCurrency } from "../../../Types/PaymentTypes";
import UseStyles from "../General/UseStyles";

export = async (t: ITransactions, c: ICustomer, charged = false) => UseStyles(stripIndents`
<div>
    <h1>
        Transaction Statement
    </h1>
    ${charged ? `<p>
        This was automatically paid for you. If you have any questions, please contact us at ${await Company_Email()}
    </p>` : ``}
    <p>
        Date: ${t.date}
    </p>
    <p>
        Customer: ${getFullName(c)}
    </p>
    <p>
        Company:
        ${await PrintCompanyInformation()}
    </p>
    <p>
        Amount: ${t.amount} ${GetCurrencySymbol(t.currency)}
    </p>
</div>
`);