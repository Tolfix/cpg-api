import CustomerModel from "../../Database/Models/Customers/Customer.model";
import easyinvoice from 'easyinvoice';
import { 
    Company_Address,
    Company_Name,
    Company_Zip,
    Company_City,
    Company_Country,
    PDF_Template_Url,
    Company_Logo_Url,
    Company_Tax_Registered,
    Company_Currency
} from "../../Config";
import { IQuotes } from "@interface/Quotes.interface";
import GetText from "../../Translation/GetText";

export default function createQuotePdf(quote: IQuotes): Promise<string>
{
    return new Promise(async (resolve, reject) =>
    {

        const Customer = await CustomerModel.findOne({ id: quote.customer_uid });
    
        if(!Customer)
            return reject("Customer not found");
    
        const data = {
            "images": {
                
            },
            "translate": {
                "invoice": `Quote #${quote.id}`,
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
                "currency": (!Customer.currency ? await Company_Currency() : Customer.currency).toUpperCase(),
                "margin-top": 25,
                "margin-right": 25,
                "margin-left": 25,
                "margin-bottom": 25,
            },
            "sender": {
                "company": (await Company_Name()),
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
            },
            "information": {
                "number": quote.id,
            },
            "products": quote.items.map((item) =>
            {
                return {
                    "quantity": item.quantity,
                    "description": item.name,
                    "tax-rate": quote.tax_rate,
                    "price": item.price
                }
            }),
        };

        if(
            Customer.billing.country.toLowerCase() === "sweden" ||
            Customer.billing.country.toLowerCase() === "sverige"
        )
            data["client"]["custom1"] = `<br/><strong>Innehar ${await Company_Tax_Registered() ? "" : "inte"} F-Skattsedel</strong>`;


        if(await Company_Logo_Url() !== "" && PDF_Template_Url === "")
            // @ts-ignore
            data["images"]["logo"] = await Company_Logo_Url();

        if(PDF_Template_Url !== "")
            // @ts-ignore
            data["images"]["background"] = PDF_Template_Url;
        
        //@ts-ignore
        await easyinvoice.createInvoice(data, (result: { pdf: any; }) =>
        {
            return resolve(result.pdf);
        });
    })
}
