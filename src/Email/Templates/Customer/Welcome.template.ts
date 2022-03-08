import { stripIndents } from "common-tags";
import { Company_Name, CPG_Customer_Panel_Domain, CPG_Shop_Domain } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";

export = async (c: ICustomer) => UseStyles(stripIndents`
<div>
    <h1>
        Welcome ${getFullName(c)} to ${await Company_Name()}!
    </h1>
    <p>
        Your account has been created.
    </p>
    <p>
        With email: ${c.personal.email}
    </p>
    ${CPG_Customer_Panel_Domain ? `
    <p>
        If you ever need to check invoices, orders, transactions or change personal information you can login into our <a href="${CPG_Customer_Panel_Domain}">customer portal</a>.
    </p>
    ` : ''}
    ${CPG_Shop_Domain ? `
    <p>
        Check out our products and services <a href="${CPG_Shop_Domain}">here</a>.
    </p>
    ` : ''}
</div>
`);