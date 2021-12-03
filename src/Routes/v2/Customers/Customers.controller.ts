import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import CustomerModel from "../../../Database/Schemas/Customers/Customer";
import { ICustomer } from "../../../Interfaces/Customer";
import { idCustomer } from "../../../Lib/Generator";
import { APIError, APISuccess } from "../../../Lib/Response";
import BaseModelAPI from "../../../Models/BaseModelAPI";
import Logger from "../../../Lib/Logger";
import { SendEmail } from "../../../Email/Send";
import { Company_Name } from "../../../Config";
import Footer from "../../../Email/Templates/General/Footer";
import getFullName from "../../../Lib/Customers/getFullName";

const API = new BaseModelAPI<ICustomer>(idCustomer, CustomerModel);

function insert(req: Request, res: Response)
{
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password ?? "123qwe123", salt, async (err, hash) => {
            if(err)
                Logger.error(err);

            req.body.password = hash;

            const email = req.body?.personal?.email;

            // Check if email already exists
            const doesExist = await CustomerModel.findOne({ "personal.email": email });

            if(doesExist)
                return APIError(`Email ${email} already exists`, 409)(res);

            API.create(req.body)
                .then((result) => {

                    // Send email to customer
                    SendEmail(result.personal.email, `Welcome to ${Company_Name}`, {
                        isHTML: true,
                        body: `
                        Welcome ${getFullName(result)} to ${Company_Name}! <br>
                        <br>
                        Your account has been created. <br>
                        With email: ${result.personal.email} <br>
                        <br>
                        <br />
                        ${Footer}`
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
    API.findByUid((req.params.uid as ICustomer["uid"])).then((result) => {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    let limit = parseInt(req.query._end as string)
    && parseInt(req.query._end as string) <= 100 ? 
                                                parseInt(req.query._end as string) 
                                                :
                                                25;
    let start = 0;
    if(req.query)
        if(req.query._start)
            start = Number.isInteger(parseInt(req.query._start as string)) ? parseInt(req.query._start as string) : 0;

    let sort = req.query._sort as string ?? "id";
    let order = req.query._order as string ?? "asc";
        
    API.findAll(limit, start, sort, order).then((result: any) => {
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
            const hash = await bcrypt.hash(req.body.password ?? "123qwe123", salt);
            req.body.password = hash;
        }
    }
    API.findAndPatch((req.params.uid as ICustomer["uid"]), req.body).then((result) => {
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API.removeByUid(req.params.uid as ICustomer["uid"])
        .then((result)=>{
            APISuccess(result, 204)(res)
        });
};

function getMyProfile(req: Request, res: Response)
{
    // @ts-ignore
    API.findByUid((req.customer.id as ICustomer["uid"])).then((result) => {
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