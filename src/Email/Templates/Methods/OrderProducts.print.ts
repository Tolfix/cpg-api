import { IOrder } from "@interface/Orders.interface";
import { stripIndents } from "common-tags";
import ConfigurableOptionsModel from "../../../Database/Models/ConfigurableOptions.model";
import getProductById from "../../../Lib/Products/getProductById";
import { convertCurrency, GetCurrencySymbol } from "../../../Lib/Currencies";
import GetTableStyle from "../CSS/GetTableStyle";
import { ICustomer } from "@interface/Customer.interface";

export default async function printOrderProductTable(order: IOrder, customer: ICustomer)
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
            ${(await Promise.all(order.products.map(async (product) =>
            {
                const p = await getProductById(product.product_id);
                if(!p) return 0;

                if(p?.currency.toUpperCase() !== customer.currency.toUpperCase())
                    p.price = await convertCurrency(p?.price, p?.currency, order.currency);
                const p_c = [];
                for await(const conf of product?.configurable_options ?? [])
                {
                    const c = await ConfigurableOptionsModel.findOne({
                        id: conf.id,
                    });

                    if(c)
                    {
                        if(p?.currency.toUpperCase() !== customer.currency.toUpperCase())
                            // Convert to customer currency
                            c.options[conf.option_index].price = await convertCurrency(c.options[conf.option_index].price, p?.currency, customer.currency);
                        p_c.push({
                            price: c.options[conf.option_index].price,
                            name: c.options[conf.option_index].name,
                        });
                    }
                }

                let result = stripIndents`
                <tr>
                    <td>${p?.name}</td>
                    <td>${product.quantity}</td>
                    <td>${p?.price.toFixed(2)} ${GetCurrencySymbol(order.currency)}</td>
                </tr>`;

                if(p_c.length > 0)
                {
                    for(const c of p_c)
                    {
                        result += stripIndents`
                        <tr>
                            <td>+ ${p?.name} - ${c?.name}</td>
                            <td>1</td>
                            <td>${c?.price.toFixed(2)} ${GetCurrencySymbol(order.currency)}</td>
                        </tr>`
                    }
                }

                return result;
            }))).join("")}
        </tbody>
    </table>
    `
}