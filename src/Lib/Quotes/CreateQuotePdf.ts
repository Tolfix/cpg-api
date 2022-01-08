import CustomerModel from "../../Database/Models/Customers/Customer";
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
import { IQuotes } from "../../Interfaces/Quotes";

export default function createQuotePdf(quote: IQuotes): Promise<string>
{
    return new Promise(async (resolve, reject) => {

        const Customer = await CustomerModel.findOne({ id: quote.customer_uid });
    
        if(!Customer)
            return reject("Customer not found");
    
        const data = {
            "images": {
                
            },
            "translate": {
                "invoice": `Quote`,
            },
            "taxNotation": "vat",
            "settings": {
                "currency": Company_Currency.toUpperCase(),
                "margin-top": 25,
                "margin-right": 25,
                "margin-left": 25,
                "margin-bottom": 25,
            },
            "sender": {
                "company": Company_Name,
                "address": Company_Address,
                "zip": Company_Zip,
                "city": Company_City,
                "country": Company_Country,
                "custom1": `<br/><strong>Innehar ${Company_Tax_Registered ? "" : "inte"} F-Skattsedel</strong>`,
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
            "products": quote.items.map((item) => {
                return {
                    "quantity": item.quantity,
                    "description": item.name,
                    "tax-rate": item.tax_rate,
                    "price": item.price
                }
            }),
        };

        if(Company_Logo_Url && PDF_Template_Url === "")
            // @ts-ignore
            data["images"]["logo"] = Company_Logo_Url;

        if(PDF_Template_Url !== "")
            // @ts-ignore
            data["images"]["background"] = PDF_Template_Url;
        
        //@ts-ignore
        easyinvoice.createInvoice(data, (result: { pdf: any; }) => {
            return resolve(result.pdf);
        });
    })
}
