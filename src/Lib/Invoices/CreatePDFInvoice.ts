import CustomerModel from "../../Database/Models/Customers/Customer.model";
import { IInvoice } from "@interface/Invoice.interface";
import easyinvoice from 'easyinvoice';
import { createSwishQRCode } from "../../Payments/Swish";
import { 
    Company_Address,
    Company_Name,
    Company_Zip,
    Company_City,
    Company_Country,
    Full_Domain,
    Paypal_Client_Secret,
    Stripe_PK_Public,
    Stripe_PK_Public_Test,
    Stripe_SK_Live,
    Stripe_SK_Test,
    Swish_Payee_Number, 
    PDF_Template_Url,
    Company_Logo_Url,
    Company_Tax_Registered,
    Company_Currency
} from "../../Config";
import qrcode from "qrcode";
import GetText from "../../Translation/GetText";
import GetOCRNumber from "./GetOCRNumber";
import { convertCurrency } from "../Currencies";

export default function createPDFInvoice(invoice: IInvoice): Promise<string>
{
    return new Promise(async (resolve, reject) =>
    {

        const Customer = await CustomerModel.findOne({ id: invoice.customer_uid });
    
        if (!Customer)
            return reject("Customer not found");
    
        const data = {
            // @ts-ignore
            "images": {
                
            },
            "translate": {
                "invoice": GetText().invoice.txt_Invoice,
                "number": GetText().invoice.txt_Number,
                "date": GetText().invoice.txt_Date,
                "due-date": GetText().invoice.txt_DueDate,
                "subtotal": GetText().invoice.txt_SubTotal,
                "products": GetText().invoice.txt_Products,
                "quantity": GetText().invoice.txt_Quantity,
                "price": GetText().invoice.txt_Price,
                "product-total": GetText().invoice.txt_ProductTotal,
                "total": GetText().invoice.txt_Total,
            },
            "taxNotation": "vat",
            "settings": {
                "currency": (!invoice.currency ? await Company_Currency() : invoice.currency).toUpperCase(),
                "margin-top": 25,
                "margin-right": 25,
                "margin-left": 25,
                "margin-bottom": 25,
            },
            "sender": {
                "company": await Company_Name(),
                "address": await Company_Address(),
                "zip": await Company_Zip(),
                "city": await Company_City(),
                "country": await Company_Country(),
            },
            "client": {
                "company": Customer.billing.company ?? `${Customer.personal.first_name} ${Customer.personal.last_name}`,
                "address": Customer.billing.street01,
                "zip": Customer.billing.postcode,
                "city": Customer.billing.city,
                "country": Customer.billing.country,
                "custom1": `<br/><strong>Customer ID:</strong> ${Customer.id}`,
                "custom2": `<br/><strong>OCR Number:</strong> ${GetOCRNumber(invoice)}`,
                "custom3": `
                <br/>
                <div style="
                    text-align:start;"
                >
                    ${(
                        Customer.billing.country.toLocaleLowerCase() === "sweden"
                        ||
                        Customer.billing.country.toLocaleLowerCase() === "sverige"
                        ) ? `
                    <div style="display:inline-block;">    
                        ${(Swish_Payee_Number && Customer.personal.phone) ? `
                        Swish
                        <div>
                            <img 
                            src="data:image/png;base64,${await createSwishQRCode(Swish_Payee_Number, await convertCurrency((invoice.amount)+(invoice.amount)*(invoice.tax_rate/100), invoice.currency, "SEK"), `OCR ${GetOCRNumber(invoice)}`)}" 
                            width="64">
                        </div>
                        ` : ''}
                    </div>
                        ` : ""}
                    <div style="display:inline-block;">

                        ${(Paypal_Client_Secret && invoice.payment_method === "paypal") ? `
                        Paypal
                        <div>
                            <a href="${Full_Domain}/v2/paypal/pay/${invoice.uid}" target="_blank">
                                <img src="${await qrcode.toDataURL(`${Full_Domain}/v2/paypal/pay/${invoice.uid}`)}" width="64">
                            </a>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div style="display:inline-block;">

                        ${(Stripe_PK_Public_Test && Stripe_SK_Test) || (Stripe_PK_Public && Stripe_SK_Live) ? `
                        Credit Card
                        <div>
                            <a href="${Full_Domain}/v2/stripe/pay/${invoice.uid}" target="_blank">
                                <img src="${await qrcode.toDataURL(`${Full_Domain}/v2/stripe/pay/${invoice.uid}`)}" width="64">
                            </a>
                        </div
                        ` : ''}

                    </div>

                </div>`,
            },
            "information": {
                "number": invoice.id,
                "date": invoice.dates.invoice_date,
                "due-date": invoice.dates.due_date
            },
            "products": invoice.items.map((item) =>
            {
                return {
                    "quantity": item.quantity,
                    "description": item.notes,
                    "tax-rate": invoice.tax_rate,
                    "price": item.amount.toFixed(2)
                }
            }),
            "bottomNotice": `
            
            `,
        };

        if (
            Customer.billing.country.toLowerCase() === "sweden" ||
            Customer.billing.country.toLowerCase() === "sverige"
        )
            data["client"]["custom1"] = `<br/><strong>Innehar ${(await Company_Tax_Registered()) ? "" : "inte"} F-Skattsedel</strong>`;

        if (await Company_Logo_Url() !== "" && PDF_Template_Url === "")
            // @ts-ignore
            data["images"]["logo"] = await Company_Logo_Url();

        if (PDF_Template_Url !== "")
            // @ts-ignore
            data["images"]["background"] = PDF_Template_Url;
        
        //@ts-ignore
        await easyinvoice.createInvoice(data, (result: { pdf: any; }) =>
        {
            return resolve(result.pdf);
        });
    })
}
