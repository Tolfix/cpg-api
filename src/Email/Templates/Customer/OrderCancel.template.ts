import { stripIndents } from "common-tags";
import { Company_Email } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import { IOrder } from "../../../Interfaces/Orders.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import UseStyles from "../General/UseStyles";

export = async (c: ICustomer, order: IOrder) => UseStyles(stripIndents`
<div>
    <h1>
        Order #${order.id}
    </h1>
    <p>
        Hello ${getFullName(c)}!
    </p>
    <p>
        Your order has been cancelled.
    </p>
    <p>
        If there has been a mistake, please contact us immediately${await Company_Email() === "" ? '' : ` at ${await Company_Email()}`}..
    </p>
</div>
`);