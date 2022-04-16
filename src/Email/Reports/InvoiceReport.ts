import { GetSMTPEmails } from "../../Config";
import { IInvoice } from "@interface/Invoice.interface";
import { SendEmail } from "../Send";
import UseStyles from "../Templates/General/UseStyles";
import { stripIndent } from "common-tags";

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
                        ${invoices.map((invoice) => `<br><strong>${invoice.id}</strong>`).join("")}
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