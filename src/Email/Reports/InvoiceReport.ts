import { GetSMTPEmails } from "../../Config";
import { IInvoice, IInvoiceMethods } from "@interface/Invoice.interface";
import { SendEmail } from "../Send";
import UseStyles from "../Templates/General/UseStyles";
import { stripIndent } from "common-tags";
import CustomerModel from "../../Database/Models/Customers/Customer.model";
import printInvoiceItemsTable from "../Templates/Methods/InvoiceItems.print";
import mainEvent from "../../Events/Main.event";

export const InvoiceNotifiedReport = async (invoices: IInvoice[]) =>
{
    GetSMTPEmails().then(async (emails) =>
    {
        for await(const email of emails)
        {
            SendEmail(email, "Invoice(s) Notified", {
                isHTML: true,
                body: await UseStyles(stripIndent`
                <div>
                    <h1>Invoice(s) Notified</h1>
                    <p>
                        ${invoices.length} invoices have been notified.
                    </p>
                    <p>
                        The following invoices have been notified:
                        ${invoices.map((invoice) => `<br><strong>${invoice.id}</strong>`).join("")}
                    </p>
                </div>
                `)
            });
        }
    })
};

export const InvoicePaidReport = async (invoice: IInvoice & IInvoiceMethods) =>
{
    const customer = await CustomerModel.findOne({ id: invoice.customer_uid });
    GetSMTPEmails().then(async (emails) =>
    {
        for await(const email of emails)
        {
            SendEmail(email, `Invoice #${invoice.id} paid`, {
                isHTML: true,
                body: await UseStyles(stripIndent`
                <div>
                    <h1>
                        Invoice #${invoice.id} has been paid.
                    </h1>
                    <p>
                        <strong>Customer:</strong> ${customer?.fullName(true)} (#${customer?.id})
                    </p>
                    <p>
                        <strong>Invoice:</strong> ${invoice.id}
                    </p>
                    <p>
                        <strong>Amount:</strong> ${invoice.amount}
                    </p>
                    <p>
                        <strong>Due date:</strong> ${invoice.dates.due_date}
                    </p>
                    <p>
                        <strong>Paid date:</strong> ${invoice.dates.date_paid}
                    </p>
                    
                    ${await printInvoiceItemsTable(invoice)}

                    <p>
                        <strong>
                            Total:
                        </strong>
                        ${invoice.getTotalAmount({ tax: true, currency: false, symbol: false }).toFixed(2)} ${invoice.currency} +(${invoice.tax_rate}%)
                    </p>
                </div>
                `)
            });
        }
    })
};
// @ts-ignore
mainEvent.on("invoice_paid", InvoicePaidReport);

export const InvoiceLateReport = async (invoices: IInvoice[]) =>
{
    GetSMTPEmails().then(async (emails) =>
    {
        for await(const email of emails)
        {
            SendEmail(email, "Invoice(s) Late Reminder", {
                isHTML: true,
                body: await UseStyles(stripIndent`
                <div>
                    <h1>Invoice(s) Reminded</h1>
                    <p>
                        ${invoices.length} invoices have been reminded.
                    </p>
                    <p>
                        The following invoices have been reminded:
                        ${invoices.map(async (invoice) => 
                        {
                            const customer = await CustomerModel.findOne({ id: invoice.customer_uid });
                            return `<br><strong>${invoice.id} (${customer?.fullName(true)} (#${customer?.id}))</strong>`;
                        }).join("")}
                    </p>
                </div>
                `)
            });
        }
    })
};

export const InvoiceCreatedReport = async (invoices: IInvoice[]) =>
{
    GetSMTPEmails().then(async (emails) =>
    {
        for await(const email of emails)
        {
            SendEmail(email, "Invoice(s) Created", {
                isHTML: true,
                body: await UseStyles(stripIndent`
                <div>
                    <h1>Invoice(s) Created</h1>
                    <p>
                        ${invoices.length} invoices have been created.
                    </p>
                    <p>
                        The following invoices have been created:
                        ${invoices.map((invoice) => `<br><strong>${invoice.id}</strong>`).join("")}
                    </p>
                </div>
                `)
            });
        }
    })
};