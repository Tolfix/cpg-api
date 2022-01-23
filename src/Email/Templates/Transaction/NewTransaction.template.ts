import { stripIndents } from "common-tags";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import { ITransactions } from "../../../Interfaces/Transactions.interface";
import PrintCompanyInformation from "../../../Lib/Company/PrintCompanyInformation";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";

export = async (t: ITransactions, c: ICustomer) => UseStyles(stripIndents`
<div>
    <h1>
        Transaction Statement
    </h1>
    <p>
        Date: ${t.date}
    </p>
    <p>
        ${await PrintCompanyInformation()}
    </p>
    <p>
        ${getFullName(c)}
    </p>
    <p>
        Amount: ${t.amount}
    </p>
</div>
`);