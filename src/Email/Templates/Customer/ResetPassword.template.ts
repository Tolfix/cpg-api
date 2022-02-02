import { stripIndents } from "common-tags";
import { Full_Domain } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";

export = async (c: ICustomer, v: string, token: string) => UseStyles(stripIndents`
<div>
    <p>
        Hello ${getFullName(c)}!
    <p>
    <p>
        You have requested to reset your password.
    </p>
    <p>
        To reset your password, please click the link below.
        <p>
            Link: <a href="${Full_Domain}/${v}/customers/my/reset-password/${token}">Reset password</a>
        </p>
    </p>
</div>
`);