import { IOrder } from "@interface/Orders.interface";
import { stripIndents } from "common-tags";
import ConfigurableOptionsModel from "../../../Database/Models/ConfigurableOptions.model";
import getProductById from "../../../Lib/Products/getProductById";
import { GetCurrencySymbol } from "../../../Types/PaymentTypes";
import GetTableStyle from "../CSS/GetTableStyle";

export default async function printOrderProductTable(order: IOrder)
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
                const p_c = [];
                for await(const conf of product?.configurable_options ?? [])
                {
                    const c = await ConfigurableOptionsModel.findOne({
                        id: conf.id,
                    });

                    if(c)
                        p_c.push({
                            price: c.options[conf.option_index].price,
                            name: c.options[conf.option_index].name,
                        });
                }

                let result = stripIndents`
                <tr>
                    <td>${p?.name}</td>
                    <td>${product.quantity}</td>
                    <td>${p?.price} ${GetCurrencySymbol(order.currency)}</td>
                </tr>`;

                if(p_c.length > 0)
                {
                    for(const c of p_c)
                    {
                        result += stripIndents`
                        <tr>
                            <td>+ ${p?.name} - ${c?.name}</td>
                            <td>1</td>
                            <td>${c?.price} ${GetCurrencySymbol(order.currency)}</td>
                        </tr>`
                    }
                }

                return result;
            }))).join("")}
        </tbody>
    </table>
    `
}