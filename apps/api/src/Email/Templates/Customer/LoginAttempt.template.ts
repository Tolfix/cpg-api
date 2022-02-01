import { ICustomer } from "@ts/interfaces";
import { stripIndents } from "common-tags";
import { Company_Email } from "../../../Config";
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
</div>
`);