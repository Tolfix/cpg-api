import { GetSMTPEmails } from "../../Config";
import { IInvoice } from "../../Interfaces/Invoice.interface";
import { SendEmail } from "../Send";

export const InvoiceNotifiedReport = async (invoices: IInvoice[]) =>
{
    GetSMTPEmails().then((emails) =>
    {
        for(const email of emails)
        {
            SendEmail(email, "Invoice(s) Notified", {
                isHTML: true,
                body: `
                <h1>Invoice(s) Notified</h1>
                <p>
                    ${invoices.length} invoices have been notified.
                </p>
                <p>
                    The following invoices have been notified:
                    ${invoices.map((invoice) => `<br><strong>${invoice.id}</strong>`).join("")}
                </p>
                `
            });
        }
    })
};

export const InvoiceLateReport = async (invoices: IInvoice[]) =>
{
    GetSMTPEmails().then((emails) =>
    {
        for(const email of emails)
        {
            SendEmail(email, "Invoice(s) Late Reminder", {
                isHTML: true,
                body: `
                <h1>Invoice(s) Reminded</h1>
                <p>
                    ${invoices.length} invoices have been reminded.
                </p>
                <p>
                    The following invoices have been reminded:
                    ${invoices.map((invoice) => `<br><strong>${invoice.id}</strong>`).join("")}
                </p>
                `
            });
        }
    })
};

export const InvoiceCreatedReport = async (invoices: IInvoice[]) =>
{
    GetSMTPEmails().then((emails) =>
    {
        for(const email of emails)
        {
            SendEmail(email, "Invoice(s) Created", {
                isHTML: true,
                body: `
                <h1>Invoice(s) Created</h1>
                <p>
                    ${invoices.length} invoices have been created.
                </p>
                <p>
                    The following invoices have been created:
                    ${invoices.map((invoice) => `<br><strong>${invoice.id}</strong>`).join("")}
                </p>
                `
            });
        }
    })
};