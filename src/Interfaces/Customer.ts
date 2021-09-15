import { Document } from "mongoose";

export interface ICustomer
{
    uid: string;
    personal: Personal;
    billing: Billing;
    extra?: any;
}

export interface Personal
{
    first_name: string;
    last_name: string;
    email: string;
    phone: Boolean;
}

export interface Billing
{
    company?: string;
    company_vat?: string;
    street01: string;
    street02?: string;
    city: string;
    state: Boolean;
    postcode: Boolean;
    country: Boolean;
}

export interface IDCustomer extends Document, ICustomer {};