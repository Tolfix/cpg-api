import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
import {ICustomer} from "@interface/Customer.interface";
import {idCustomer} from "../../../../Lib/Generator";
import {APIError, APISuccess} from "../../../../Lib/Response";
import BaseModelAPI from "../../../../Models/BaseModelAPI";
import Logger from "../../../../Lib/Logger";
import {SendEmail} from "../../../../Email/Send";
import {Company_Currency, Company_Name} from "../../../../Config";
import mainEvent from "../../../../Events/Main.event";
import {sanitizeMongoose} from "../../../../Lib/Sanitize";
import WelcomeTemplate from "../../../../Email/Templates/Customer/Welcome.template";
import {currencyCodes, TPaymentCurrency} from "../../../../Lib/Currencies";

const API = new BaseModelAPI<ICustomer>(idCustomer, CustomerModel);

function insert(req: Request, res: Response)
{
    bcrypt.genSalt(10, (err, salt) =>
    {
        bcrypt.hash(req.body.password ?? "123qwe123", salt, async (err, hash) =>
        {
            if(err)
                Logger.error(err);

            req.body.password = hash;

            const email = req.body?.personal?.email;

            // Check if email already exists
            const doesExist = await CustomerModel.findOne({ "personal.email": sanitizeMongoose(email) });

            if(doesExist)
                return APIError(`Email ${email} already exists`, 409)(res);

            if(!req.body.currency)
            {
                req.body.currency = await Company_Currency();
            }

            // Check if our currency is valid
            // req.body.currency = igh7183
            const validCurrency = (currency: string) =>
            {
                currency = currency.toUpperCase();
                return currencyCodes.includes(currency as TPaymentCurrency);


            }

            if(!validCurrency(req.body.currency))
                req.body.currency = await Company_Currency();        

            API.create(req.body)
                .then(async (result) =>
                {
                    
                    mainEvent.emit("customer_created", result);

                    // Send email to customer
                    await SendEmail(result.personal.email, `Welcome to ${await Company_Name()}`, {
                        isHTML: true,
                        body: await WelcomeTemplate(result),
                    });

                    APISuccess({
                        uid: result.uid
                    })(res);
                });
        });
    });
}

function getByUid(req: Request, res: Response)
{
    API.findByUid((req.params.uid as ICustomer["uid"])).then((result) =>
    {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    API.findAll(req.query, res).then((result: any) =>
    {
        APISuccess(result)(res)
    });
}

async function patch(req: Request, res: Response)
{
    if(req.body.password)
    {
        // Check if they are the same..
        const Customer = await CustomerModel.findOne({ id: req.params.uid });
        if(Customer?.password !== req.body.password)
        {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password ?? "123qwe123", salt);
        }
    }
    API.findAndPatch((req.params.uid as ICustomer["uid"]), req.body).then((result) =>
    {
        // @ts-ignore
        mainEvent.emit("customer_updated", result);
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as ICustomer["uid"])
        .then((result)=>
        {
            // @ts-ignore
            mainEvent.emit("customer_deleted", result);
            APISuccess(result, 204)(res)
        });
}

function getMyProfile(req: Request, res: Response)
{
    // @ts-ignore
    API.findByUid((req.customer.id as ICustomer["uid"])).then((result) =>
    {
        APISuccess(result)(res);
    });
}

const CustomerController = {
    insert,
    getByUid,
    list,
    patch,
    removeById,
    getMyProfile
}

export default CustomerController;