import CustomerModel from "../../Database/Schemas/Customer";
import { IInvoice } from "../../Interfaces/Invoice";
import easyinvoice from 'easyinvoice';

export default function createPDFInvoice(invoice: IInvoice): Promise<string>
{
    return new Promise(async (resolve, reject) => {

        const Customer = await CustomerModel.findOne({ id: invoice.customer_uid });
    
        if(!Customer)
            throw new Error("Customer not found");
    
        let data = {
            "currency": "SEK",
            "taxNotation": "vat",
            "marginTop": 25,
            "marginRight": 25,
            "marginLeft": 25,
            "marginBottom": 25,
            "background": "https://cdn.tolfix.com/images/pdf/Template_Invoice.pdf",
            "sender": {
                "company": "Tolfix",
                "address": "Kalendervägen 23",
                "zip": "415 34",
                "city": "Göteborg",
                "country": "Sweden"
            },
            "client": {
                "company": Customer.billing.company ?? `${Customer.personal.first_name} ${Customer.personal.last_name}`,
                "address": Customer.billing.street01,
                "zip": Customer.billing.postcode,
                "city": Customer.billing.city,
                "country": Customer.billing.country
            },
            // @ts-ignore
            "invoiceNumber": invoice.id,
            "invoiceDate": invoice.dates.invoice_date,
            "invoiceDueDate": invoice.dates.due_date,
            "products": invoice.items.map((item) => {
                return {
                    "quantity": item.quantity,
                    "description": item.notes,
                    "tax": invoice.tax_rate,
                    "price": item.amount
                }
            }),
            "bottomNotice": `Due Date: ${invoice.dates.due_date}
            `,
        };
        
        //@ts-ignore
        easyinvoice.createInvoice(data, (result: { pdf: any; }) => {
            return resolve(result.pdf);
        });
    })
}