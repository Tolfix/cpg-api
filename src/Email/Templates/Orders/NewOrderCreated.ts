import { ICustomer } from "../../../Interfaces/Customer";
import { IOrder } from "../../../Interfaces/Orders";
import getFullName from "../../../Lib/Customers/getFullName";
import getProductById from "../../../Lib/Products/getProductById";

export default (order: IOrder, customer: ICustomer) => `Hello ${getFullName(customer)}!
<br />
A new order has been created for you.
<br />
<br />

Order nmr.: ${order.id}
<br />
Products: ${order.products.map(async product => {
    const p = await getProductById(product.product_id as any);
    if(!p)
        return '';
    return `${p.name} - (${p.price} SEK)`;
}).join("<br />")}
<br />

`