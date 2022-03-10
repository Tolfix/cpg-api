import { IQuotes } from "@interface/Quotes.interface";
import { GetCurrencySymbol } from "../../../Lib/Currencies";
import GetTableStyle from "../CSS/GetTableStyle";

export default async function printQuotesItemsTable(quote: IQuotes)
{
    return `
    <table style="${GetTableStyle}">
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            ${(await Promise.all(quote.items.map(async item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price} ${GetCurrencySymbol(quote.currency)}</td>
                </tr>
            `))).join('')}
        </tbody>
    </table>
    `
}