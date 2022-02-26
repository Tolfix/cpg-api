import mail from "nodemailer";
import { Company_Name, GetSMTPConfig } from "../Config";
import { IConfigs } from "../Interfaces/Admin/Configs.interface";
import AW from "../Lib/AW";
import Logger from "../Lib/Logger";

/**
 * @description
 * Send a email
 */
export async function SendEmail(
    reciever: string, 
    subject: string, 
    body: {
        isHTML: boolean;
        body: any;
        attachments?: any;
    },
    callback?: (error: Error|null, sent: boolean|null) => void
): Promise<boolean | void>
{
    const [SMTPConfig, SMTP_Error] = await AW<IConfigs["smtp"]>(await GetSMTPConfig());
    if(!SMTPConfig || SMTP_Error)
        throw new Error(`No SMTP config.`);

    const config = {
        host: SMTPConfig.host,
        port: SMTPConfig.port,
        secure: SMTPConfig.secure,
        secureConnection: false,
        ignoreTLS: false,
        requireTLS: true,
        auth: {
            user: SMTPConfig.username,
            pass: SMTPConfig.password
        },
        tls: {
            rejectUnauthorized: false
        },
    }

    const email: {
        from: string;
        to: string;
        subject: string;
        text?: string;
        html?: string;
        attachments?: any;
    } = {
        from: `"${await Company_Name()}" <${SMTPConfig.username}>`,
        to: `${reciever}`,
        subject: subject,
    }

    if(body.isHTML)
        email.html = body.body;

    if(!body.isHTML)
        email.text = body.body

    if(body.attachments)
        email.attachments = body.attachments;

    //@ts-ignore
    const transport = mail.createTransport(config);

    Logger.info(`Sending email to ${reciever}`);

    transport.sendMail(email).then(() =>
    {
        callback ? callback?.(null, true) : Promise.resolve(true);
    }).catch(e =>
    {
        callback ? callback?.(e, false) : Promise.resolve(false);
    });
}

export async function sendEmail(options: {
    reciever: string;
    subject: string;
    body: {
        body: any;
        attachments?: any;
    };
})
{
    const [SMTPConfig, SMTP_Error] = await AW<IConfigs["smtp"]>(await GetSMTPConfig());
    if(!SMTPConfig || SMTP_Error)
        throw new Error(`No SMTP config.`);

    const config = {
        host: SMTPConfig.host,
        port: SMTPConfig.port,
        secure: SMTPConfig.secure,
        secureConnection: false,
        ignoreTLS: false,
        requireTLS: true,
        auth: {
            user: SMTPConfig.username,
            pass: SMTPConfig.password
        },
        tls: {
            rejectUnauthorized: false
        },
    }

    const email: {
        from: string;
        to: string;
        subject: string;
        html: string;
        attachments?: any;
    } = {
        from: `"${await Company_Name()}" <${SMTPConfig.username}>`,
        to: `${options.reciever}`,
        html: options.body.body,
        subject: options.subject,
    }

    if(options.body.attachments)
        email.attachments = options.body.attachments;

    //@ts-ignore
    const transport = mail.createTransport(config);

    Logger.info(`Sending email to ${options.reciever}`);

    return transport.sendMail(email);
}