import { Application, Router } from "express";
import { CacheCustomer } from "../Cache/CacheCustomer";
import CustomerModel from "../Database/Schemas/Customer";
import { ICustomer } from "../Interfaces/Customer";
import AW from "../Lib/AW";
import { idCustomer } from "../Lib/Generator";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

export default class CustomerRouter
{
    private server: Application;
    private router = Router();

    public name = "Customer";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/customer", this.router);

        this.router.get("/get/all", EnsureAdmin, (req, res) => {
            APISuccess(CacheCustomer.array())(res);
        });

        this.router.get("/get/:uid", EnsureAdmin, (req, res) => {
            const id = req.params.uid;

            const customer = CacheCustomer.get(id);

            if(!customer)
                return APIError({
                    text: `Unable to find customer by uid ${id}`
                })(res);

            return APISuccess({
                customer: customer
            })(res);
        });

        this.router.post("/post/create", (req, res) => {

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
            } = req.body;

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
                uid: idCustomer().toString(),
                createdAt: new Date(),
                extra
            };

            new CustomerModel(CustomerData).save();
            CacheCustomer.set(CustomerData.uid, CustomerData);

            return APISuccess({
                text: `Succesfully created user`,
                data: CustomerData,
            })(res);
        });

        this.router.patch("/patch/:uid", EnsureAdmin, async (req, res) => {
            const uid = req.params.uid;

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
            } = req.body;

            let CustomerData: ICustomer = {
                personal: customer.personal,
                billing: customer.billing,
                uid: customer.uid,
                createdAt: customer.createdAt,
                extra: customer.extra,
            };

            if(first_name !== CustomerData.personal.first_name)
                CustomerData.personal.first_name = first_name;
        
            if(last_name !== CustomerData.personal.last_name)
                CustomerData.personal.last_name = last_name;

            if(email !== CustomerData.personal.email)
                CustomerData.personal.email = email;

            if(phone !== CustomerData.personal.phone)
                CustomerData.personal.phone = phone;

            if(company !== CustomerData.billing.company)
                CustomerData.billing.company = company;

            if(company_vat !== CustomerData.billing.company_vat)
                CustomerData.billing.company_vat = company_vat;

            if(street01 !== CustomerData.billing.street01)
                CustomerData.billing.street01 = street01;

            if(street02 !== CustomerData.billing.street02)
                CustomerData.billing.street02 = street02;

            if(city !== CustomerData.billing.city)
            CustomerData.billing.city = city;

            if(state !== CustomerData.billing.state)
                CustomerData.billing.state = state;

            if(postcode !== CustomerData.billing.postcode)
                CustomerData.billing.postcode = postcode;

            if(country !== CustomerData.billing.country)
                CustomerData.billing.country = country;

            if(extra !== CustomerData.extra)
                CustomerData.extra = extra;

            const [Succes, Fail] = await AW(CustomerModel.updateOne({ uid: CustomerData.uid }, CustomerData));

            if(Fail)
                return APIError({
                    text: `Something went wrong, try again later.`,
                })(res);

            CacheCustomer.set(CustomerData.uid, CustomerData);

            return APISuccess({
                text: `Succesfully updated user`,
                data: CustomerData,
            })(res);
        });

        this.router.delete("/delete/:uid", EnsureAdmin, async (req, res) => {
            const uid = req.params.uid;

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