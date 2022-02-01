import { ICustomer } from "@ts/interfaces";

export default (customer: ICustomer) => `${customer.personal.first_name} ${customer.personal.last_name}`; 