import { ICustomer } from "@ts/interfaces";
import { stripIndents } from "common-tags";
import { Company_Name } from "../../../Config";
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
    </div>
`);