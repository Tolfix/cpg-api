import { Document } from "mongoose";
import { TPayments } from "../../Types/PaymentMethod";

export interface IConfigs
{
    smtp: ISmtp;
    smtp_emails: Array<string>;
    webhooks_urls: Array<string>;
    company: ICompanyConfig;
    payment_methods: Array<Partial<TPayments>>;
}

export interface ICompanyConfig
{
    name: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    vat: string;
    currency: string;
    logo_url: string;
    tax_registered: boolean;
    website: string;
}

export interface IDConfigs extends IConfigs, Document {}

export interface ISmtp
{
    host: string;
    username: string;
    password: string;
    secure: boolean;
    port: number;
}