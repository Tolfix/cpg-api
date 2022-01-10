import { GetSMTPEmails } from "../Config";
import { SendEmail } from "../Email/Send";
import mainEvent from "./Main.event";

mainEvent.on("invoice_created", async (invoice) =>
{
    // Send email to our admins from config
    const emails = await GetSMTPEmails();
    emails.forEach(async (email) =>
    {
    
        await SendEmail(email, "Invoice created", {
            isHTML: false,
            body: `Invoice ${invoice.id} has been created`,
        });
    
    });
});

// Send email to our admins when invoice is paid
mainEvent.on("invoice_paid", async (invoice) =>
{
    // Send email to our admins from config
    const emails = await GetSMTPEmails();
    emails.forEach(async (email) =>
    {
    
        await SendEmail(email, "Invoice paid", {
            isHTML: false,
            body: `Invoice ${invoice.id} has been paid`,
        });
    
    });
});

// Send email to our admins when invoice is deleted
mainEvent.on("invoice_deleted", async (invoice) =>
{
    // Send email to our admins from config
    const emails = await GetSMTPEmails();
    emails.forEach(async (email) =>
    {
    
        await SendEmail(email, "Invoice deleted", {
            isHTML: false,
            body: `Invoice ${invoice.id} has been deleted`,
        });
    
    });
});

// Send email to our admins when invoice is notified
mainEvent.on("invoice_notified", async (invoice) =>
{
    // Send email to our admins from config
    const emails = await GetSMTPEmails();
    emails.forEach(async (email) =>
    {
    
        await SendEmail(email, "Invoice notified", {
            isHTML: false,
            body: `Invoice ${invoice.id} has been notified`,
        });
    
    });
});