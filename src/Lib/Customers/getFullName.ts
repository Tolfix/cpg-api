import { ICustomer } from "../../Interfaces/Customer";

export default (customer: ICustomer) => `${customer.personal.first_name} ${customer.personal.last_name}`; 