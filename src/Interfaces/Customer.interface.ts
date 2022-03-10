import { TPaymentCurrency } from "../Lib/Currencies";
import { ICompanyConfig } from "./Admin/Configs.interface";
import { IImage } from "./Images.interface";

/**
 * @typedef Customer
 * @property {string} first_name - First name of customer
 * @property {string} last_name - Last name of customer
 * @property {string} email - Email of customer
 * @property {string} phone - Phone number of customer
 * @property {string} company - Company name of customer company
 * @property {string} company_vat - Company vat name of customer company
 * @property {string} city - City of customer
 * @property {string} street01 - Street 01 of customer
 * @property {string} street02 - Street 02 of customer
 * @property {string} state - State of customer
 * @property {string} postcode - Postcode of customer
 * @property {string} country - Country of customer
 * @property {object} extra - Extra data of customer
 */

export interface ICustomer
{
    id: any;
    uid: `CUS_${string}`;
    personal: Personal;
    billing: Billing;
    password: string;
    createdAt: Date;
    profile_picture: IImage["id"] | null;
    currency: TPaymentCurrency | ICompanyConfig["currency"];
    extra: {
        [key: string]: any;
    };
}

export interface ICustomerMethods
{
    fullName<incCo extends boolean | undefined = undefined>(sC?: incCo): incCo extends undefined ? `${string} ${string}` : `${string} ${string} ${string}`;
}

export interface Personal
{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export interface Billing
{
    company?: string;
    company_vat?: string;
    street01: string;
    street02?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}