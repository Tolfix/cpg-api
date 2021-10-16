import { Application, Router } from "express";
import { CacheCustomer } from "../../Cache/CacheCustomer";
import CustomerModel from "../../Database/Schemas/Customer";
import { ICustomer } from "../../Interfaces/Customer";
import AW from "../../Lib/AW";
import { idCustomer } from "../../Lib/Generator";
import { APIError, APISuccess } from "../../Lib/Response";
import EnsureAdmin from "../../Middlewares/EnsureAdmin";

export default class CustomerRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/customers", this.router);

        /**
         * Gets all customers
         * @route GET /customers
         * @group Customer
         * @returns {Array} 200 - An array for customers
         * @security JWT
         * @security Basic
         */
        this.router.get("/", EnsureAdmin, (req, res) => {
            APISuccess({
                customers: CacheCustomer.array()
            })(res);
        });

        /**
         * Gets specific customers
         * @route GET /customers/{uid}
         * @group Customer
         * @param {string} uid.path.required - uid of customer.
         * @returns {Object} 200 - The customer
         * @returns {Error} 400 - Unable to find customer 
         * @security JWT
         * @security Basic
         */        
        this.router.get("/:uid", EnsureAdmin, (req, res) => {
            const id = req.params.uid as ICustomer["uid"];

            const customer = CacheCustomer.get(id);

            if(!customer)
                return APIError({
                    text: `Unable to find customer by uid ${id}`
                })(res);

            return APISuccess({
                customer: customer
            })(res);
        });

        /**
         * Creates a customer
         * @route POST /customers/create
         * @group Customer
         * @param {Customer.model} data.body.required - Data for customer
         * @returns {Object} 200 - Created a new customer.
         * @returns {Error} default - Missing something
         * @security JWT
         * @security Basic
         */
        this.router.post("/create", (req, res) => {

            let {
                first_name,
                last_name,
                email,
                phone,
                company,
                company_vat,
                street01,
                street02,
                city,
                state,
                postcode,
                country,
                extra
            } = req.body as any;

            // Check each if they exist
            if(!first_name)
                return APIError({
                    text: "Missing 'first_name' in body"
                })(res);
        
            if(!last_name)
                return APIError({
                    text: "Missing 'last_name' in body"
                })(res);

            if(!email)
                return APIError({
                    text: "Missing 'email' in body"
                })(res);

            if(!phone)
                return APIError({
                    text: "Missing 'phone' in body"
                })(res);

            if(!street01)
                return APIError({
                    text: "Missing 'street01' in body"
                })(res);

            if(!city)
                return APIError({
                    text: "Missing 'city' in body"
                })(res);
        
            if(!state)
                return APIError({
                    text: "Missing 'state' in body"
                })(res);
                
            if(!postcode)
                return APIError({
                    text: "Missing 'postcode' in body"
                })(res);

            if(!country)
                return APIError({
                    text: "Missing 'country' in body"
                })(res);

            let CustomerData: ICustomer = {
                personal: {
                    email,
                    first_name,
                    last_name,
                    phone
                },
                billing: {
                    city,
                    country,
                    postcode,
                    state,
                    street01,
                    company,
                    company_vat,
                    street02
                },
                uid: idCustomer(),
                createdAt: new Date(),
                extra
            };

            new CustomerModel(CustomerData).save();
            CacheCustomer.set(CustomerData.uid, CustomerData);

            return APISuccess({
                text: `Succesfully created user`,
                customer: CustomerData,
            })(res);
        });

        /**
         * Updates a customer
         * @route PATCH /customers/{uid}
         * @group Customer
         * @param {string} uid.path.required - Uid of customer.
         * @param {Customer.model} data.body - Data for customer
         * @returns {Object} 200 - Updated customer.
         * @returns {Error} default - Missing something
         * @security JWT
         * @security Basic
         */
        this.router.patch("/:uid", EnsureAdmin, async (req, res) => {

            const uid = req.params.uid as ICustomer["uid"];

            const customer = CacheCustomer.get(uid);

            if(!customer)
                return APIError({
                    text: `Couldn't find customer with uid ${uid}`
                })(res);

            let {
                first_name,
                last_name,
                email,
                phone,
                company,
                company_vat,
                street01,
                street02,
                city,
                state,
                postcode,
                country,
                extra
            } = req.body as any;

            let CustomerData: ICustomer = {
                personal: customer.personal,
                billing: customer.billing,
                uid: customer.uid,
                createdAt: customer.createdAt,
                extra: customer.extra,
            };

            if(first_name && first_name !== CustomerData.personal.first_name)
                CustomerData.personal.first_name = first_name;
        
            if(last_name && last_name !== CustomerData.personal.last_name)
                CustomerData.personal.last_name = last_name;

            if(email && email !== CustomerData.personal.email)
                CustomerData.personal.email = email;

            if(phone && phone !== CustomerData.personal.phone)
                CustomerData.personal.phone = phone;

            if(company && company !== CustomerData.billing.company)
                CustomerData.billing.company = company;

            if(company_vat && company_vat !== CustomerData.billing.company_vat)
                CustomerData.billing.company_vat = company_vat;

            if(street01 && street01 !== CustomerData.billing.street01)
                CustomerData.billing.street01 = street01;

            if(street02 && street02 !== CustomerData.billing.street02)
                CustomerData.billing.street02 = street02;

            if(city && city !== CustomerData.billing.city)
                CustomerData.billing.city = city;

            if(state && state !== CustomerData.billing.state)
                CustomerData.billing.state = state;

            if(postcode && postcode !== CustomerData.billing.postcode)
                CustomerData.billing.postcode = postcode;

            if(country && country !== CustomerData.billing.country)
                CustomerData.billing.country = country;

            if(extra && extra !== CustomerData.extra)
                CustomerData.extra = extra;

            const [Succes, Fail] = await AW(CustomerModel.updateOne({ uid: CustomerData.uid }, CustomerData));

            if(Fail)
                return APIError({
                    text: `Something went wrong, try again later.`,
                })(res);

            CacheCustomer.set(CustomerData.uid, CustomerData);

            return APISuccess({
                text: `Succesfully updated user`,
                customer: CustomerData,
            })(res);
        });

        /**
         * Deletes customers
         * @route DELETE /customers/{uid}
         * @group Customer
         * @param {string} uid.path.required - uid of customer.
         * @returns {Object} 200 - Removed the customer.
         * @returns {Error} 400 - Unable to find customer.
         * @security JWT
         * @security Basic
         */
        this.router.delete("/:uid", EnsureAdmin, async (req, res) => {
            const uid = req.params.uid as ICustomer["uid"];

            const customer = CacheCustomer.get(uid);

            if(!customer)
                return APIError({
                    text: `Unable to find customer with uid ${uid}`,
                })(res);

            const [Success, Fail] = await AW(CustomerModel.deleteOne({ uid: uid }));

            if(Fail)
                return APIError({
                    text: `Something went wrong, try again later.`,
                })(res);

            CacheCustomer.delete(uid);

            return APISuccess({
                text: `Succesfully removed customer`,
                uid: uid,
            })(res);
        });
    }
}