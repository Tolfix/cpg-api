import CustomerModel from "../../Database/Models/Customers/Customer.model";
import { SendEmail } from "../../Email/Send";
import NewTransactionTemplate from "../../Email/Templates/Transaction/NewTransaction.template";
import { ITransactions } from "@interface/Transactions.interface";

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

    await SendEmail(customer.personal.email, "Transaction Statement", {
        isHTML: true,
        body: await NewTransactionTemplate(t, customer),
    });

    return true;
}