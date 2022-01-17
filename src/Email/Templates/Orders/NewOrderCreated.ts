import { Company_Currency } from "../../../Config";
import { ICustomer } from "../../../Interfaces/Customer.interface";
import { IOrder } from "../../../Interfaces/Orders.interface";
import getFullName from "../../../Lib/Customers/getFullName";
import getProductById from "../../../Lib/Products/getProductById";
import Footer from "../General/Footer";

export default async (order: IOrder, customer: ICustomer) => `Hello ${getFullName(customer)}!
<br />
Order nmr.: ${order.id}
<br />
Products: <br/>${(await Promise.all(order.products.map(async (product) =>
{
    const p = await getProductById(product.product_id as any);
    if (!p)
        return '';
    return `${p.name} - (${p.price} ${(await Company_Currency()).toLocaleUpperCase()})`;
}))).join("<br />")}
<br />
Total: ${(await Promise.all(order.products.map(async (product) =>
{
    const p = await getProductById(product.product_id as any);
    if (!p)
        return 0;
    return p.price;
}))).reduce((acc, cur) => acc + cur, 0)} ${(await Company_Currency()).toLocaleUpperCase()}

<br />
${Footer}
`