import { stripIndents } from "common-tags";
import { Company_Email, CPG_Customer_Panel_Domain } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";

export = async (c: ICustomer) => UseStyles(stripIndents`
<div>
    <h1>
        Login attempts on your account.
    </h1>
    <p>
        Hello ${getFullName(c)}!
    </p>
    <p>
        Someone has been trying to login to your account. <br />
        If this was not you, please contact us immediately${await Company_Email() === "" ? '' : ` at ${await Company_Email()}`}.
    </p>
    ${CPG_Customer_Panel_Domain ? `
    <p>
        <a href="${CPG_Customer_Panel_Domain}/profile">Login to change credentials.</a>
    </p>
    ` : ''}
</div>
`);