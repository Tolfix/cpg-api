import { stripIndents } from "common-tags";
import { CPG_Customer_Panel_Domain } from "../../../Config";
import ConfigurableOptionsModel from "../../../Database/Models/ConfigurableOptions.model";
import { ICustomer } from "@interface/Customer.interface";
import { IOrder } from "@interface/Orders.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import getProductById from "../../../Lib/Products/getProductById";
import UseStyles from "../General/UseStyles";
import printOrderProductTable from "../Methods/OrderProducts.print";

export default async (order: IOrder, customer: ICustomer) => await UseStyles(stripIndents`
<div>
    <h1>Hello ${getFullName(customer)}.</h1>
    <p>
        Your order has been created.
    </p>
    <p>
        <strong>Order number:</strong> ${order.id}
    </p>

    ${printOrderProductTable(order)}

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
                }))).reduce((acc, cur) => acc + cur, 0)} ${(order.currency).toLocaleUpperCase()}
    </p>

    ${CPG_Customer_Panel_Domain ? `
    <p>
        <a href="${CPG_Customer_Panel_Domain}/orders/${order.id}">View Order</a>
    </p>
    ` : ''}

</div>
`);