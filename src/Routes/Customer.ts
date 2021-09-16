import { Application, Router } from "express";
import { CacheCustomer } from "../Cache/CacheCustomer";
import CustomerModel from "../Database/Schemas/Customer";
import { ICustomer } from "../Interfaces/Customer";
import { idCustomer } from "../Lib/Generator";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAuth from "../Middlewares/EnsureAuth";

export default class CustomerRouter
{
    private server: Application;
    private router = Router();

    public name = "Customer";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/customer", this.router);

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

        this.router.get("/:uid", EnsureAuth, (req, res) => {

        });
    }
}