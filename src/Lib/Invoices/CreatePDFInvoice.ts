import CustomerModel from "../../Database/Schemas/Customer";
import { IInvoice } from "../../Interfaces/Invoice";
import easyinvoice from 'easyinvoice';
import { createSwishQRCode } from "../../Payments/Swish";
import { Full_Domain, Paypal_Client_Secret, Stripe_PK_Public, Stripe_PK_Public_Test, Stripe_SK_Live, Stripe_SK_Test, Swish_Payee_Number } from "../../Config";
import qrcode from "qrcode";

export default function createPDFInvoice(invoice: IInvoice): Promise<string>
{
    return new Promise(async (resolve, reject) => {

        const Customer = await CustomerModel.findOne({ id: invoice.customer_uid });
    
        if(!Customer)
            throw new Error("Customer not found");
    
        let data = {
            // @ts-ignore
            "documentTitle": `Invoice #${invoice.id}`,
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
                "country": "Sweden",
                "custom1": "<br/><strong>Innehar F-Skattsedel</strong>",
            },
            "client": {
                "company": Customer.billing.company ?? `${Customer.personal.first_name} ${Customer.personal.last_name}`,
                "address": Customer.billing.street01,
                "zip": Customer.billing.postcode,
                "city": Customer.billing.city,
                "country": Customer.billing.country,
                "custom1": `<br/><strong>Customer ID:</strong> ${Customer.id}`,
                "custom2": `
                <div style="
                position: fixed;
                right: 28;
                top: 224;
                ">
                    <strong>Due Date:</strong> ${invoice.dates.due_date}
                </div>`,
            },
            // @ts-ignore
            "invoiceNumber": invoice.id,
            "invoiceDate": invoice.dates.invoice_date,
            // "invoiceDueDate": invoice.dates.due_date,
            "products": invoice.items.map((item) => {
                return {
                    "quantity": item.quantity,
                    "description": item.notes,
                    "tax": invoice.tax_rate,
                    "price": item.amount
                }
            }),
            "bottomNotice": `
            <div style="
                text-align:start;
                
            ">
                <div style="display:inline-block;">    
                    ${(Swish_Payee_Number && Customer.personal.phone) ? `
                    QR-Kod för Swish
                    <div>
                        <img src="data:image/png;base64,${await createSwishQRCode(Swish_Payee_Number, (invoice.amount)+(invoice.amount)*(invoice.tax_rate/100), `Invoice ${invoice.id}`)}" width="95">
                    </div>
                    ` : ''}
                </div>
                <div style="display:inline-block;">

                    ${(Paypal_Client_Secret) ? `
                    QR-Kod för Paypal (Klickbar)
                    <div>
                        <a href="${Full_Domain}/v2/paypal/pay/${invoice.uid}" target="_blank">
                            <img src="${await qrcode.toDataURL(`${Full_Domain}/v2/paypal/pay/${invoice.uid}`)}" width="95">
                        </a>
                    </div>
                    ` : ''}
                </div>
                
                <div style="">

                    ${(Stripe_PK_Public_Test && Stripe_SK_Test) || (Stripe_PK_Public && Stripe_SK_Live) ? `
                    QR-Kod för Kredit kort (Klickbar)
                    <div>
                        <a href="${Full_Domain}/v2/stripe/pay/${invoice.uid}" target="_blank">
                            <img src="${await qrcode.toDataURL(`${Full_Domain}/v2/stripe/pay/${invoice.uid}`)}" width="95">
                        </a>
                    </div
                    ` : ''}'

                </div>

            </div>
            `,
        };
        
        //@ts-ignore
        easyinvoice.createInvoice(data, (result: { pdf: any; }) => {
            return resolve(result.pdf);
        });
    })
}