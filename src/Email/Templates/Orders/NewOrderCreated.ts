import { ICustomer } from "../../../Interfaces/Customer";
import { IOrder } from "../../../Interfaces/Orders";
import getFullName from "../../../Lib/Customers/getFullName";
import getProductById from "../../../Lib/Products/getProductById";
import Footer from "../General/Footer";

export default async (order: IOrder, customer: ICustomer) => `Hello ${getFullName(customer)}!
<br />
Order nmr.: ${order.id}
<br />
Products: ${(await Promise.all(order.products.map(async (product) => {
    const p = await getProductById(product.product_id as any);
    if (!p)
        return '';
    return `${p.name} - (${p.price} SEK)`;
}))).join("<br />")}
<br />
Total: ${(await Promise.all(order.products.map(async (product) => {
    const p = await getProductById(product.product_id as any);
    if (!p)
        return 0;
    return p.price;
}))).reduce((acc, cur) => acc + cur, 0)} SEK

<br />
${Footer}
`