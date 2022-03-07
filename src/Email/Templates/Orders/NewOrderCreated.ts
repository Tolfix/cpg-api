import { stripIndents } from "common-tags";
import { Company_Currency } from "../../../Config";
import ConfigurableOptionsModel from "../../../Database/Models/ConfigurableOptions.model";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import { IOrder } from "../../../Interfaces/Orders.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import getProductById from "../../../Lib/Products/getProductById";
import { GetCurrencySymbol, TPaymentCurrency } from "../../../Types/PaymentTypes";
import GetTableStyle from "../CSS/GetTableStyle";
import UseStyles from "../General/UseStyles";

export default async (order: IOrder, customer: ICustomer) => await UseStyles(stripIndents`
<div>
    <h1>Hello ${getFullName(customer)}.</h1>
    <p>
        Your order has been created.
    </p>
    <p>
        Order number: ${order.id}
    </p>

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
                    <td>${p?.price} ${GetCurrencySymbol((!customer.currency ? await Company_Currency() : customer.currency) as TPaymentCurrency)}</td>
                </tr>`;

                if(p_c.length > 0)
                {
                    for(const c of p_c)
                    {
                        result += stripIndents`
                        <tr>
                            <td>+ ${p?.name} - ${c?.name}</td>
                            <td>1</td>
                            <td>${c?.price} ${GetCurrencySymbol((!customer.currency ? await Company_Currency() : customer.currency) as TPaymentCurrency)}</td>
                        </tr>`
                    }
                }

                return result;
            }))).join("")}
        </tbody>
    </table>
    <p>
        <strong> 
        Total:
        </strong>
         ${(await Promise.all(order.products.map(async (product) =>
                {
                    const p = await getProductById(product.product_id as any);
                    // check if configurable options are added
                    const p_c = [];
                    for await(const conf of product?.configurable_options ?? [])
                    {
                        const c = await ConfigurableOptionsModel.findOne({
                            id: conf.id,
                        });
                        if(c)
                            p_c.push(c.options[conf.option_index].price);
                    }

                    
                    if (!p)
                        return 0;

                    let total = p?.price * product.quantity;
                    if(p_c.length > 0)
                        total += p_c.reduce((a, b) => a + b);

                    return total;
                }))).reduce((acc, cur) => acc + cur, 0)} ${(!customer.currency ? await Company_Currency() : customer.currency).toLocaleUpperCase()}
    </p>
</div>
`);