import { ITransactions } from "@ts/interfaces";
import CustomerModel from "../../Database/Models/Customers/Customer.model";
import { SendEmail } from "../../Email/Send";
import NewTransactionTemplate from "../../Email/Templates/Transaction/NewTransaction.template";

export default async function sendEmailOnTransactionCreation(t: ITransactions)
{
    const customer = await CustomerModel.findOne({
        $or: [
            {
                "uid": t.customer_uid
            },
            {
                "id": t.customer_uid
            }
        ]
    });

    if(!customer)
        return Promise.resolve(false);

    SendEmail(customer.personal.email, "Transaction Statement", {
        isHTML: true,
        body: await NewTransactionTemplate(t, customer),
    });

    Promise.resolve(true);
} 