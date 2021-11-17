import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import CustomerModel from "../../../Database/Schemas/Customer";
import { ICustomer } from "../../../Interfaces/Customer";
import { idCustomer } from "../../../Lib/Generator";
import { APIError, APISuccess } from "../../../Lib/Response";
import BaseModelAPI from "../../../Models/BaseModelAPI";
import Logger from "../../../Lib/Logger";

const API_CustomerModel = new BaseModelAPI<ICustomer>(idCustomer, CustomerModel);

function insert(req: Request, res: Response)
{
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password ?? "123qwe123", salt, async (err, hash) => {
            if(err)
                Logger.error(err);

            req.body.password = hash;

            const email = req.body.email;

            // Check if email already exists
            const doesExist = await CustomerModel.findOne({ email: email });

            if(doesExist)
                return APIError(`Email ${email} already exists`, 409)(res);

            API_CustomerModel.create(req.body)
                .then((result) => {
                    APISuccess({
                        uid: result.uid
                    })(res);
                });
        });
    });
}

function getByUid(req: Request, res: Response)
{
    API_CustomerModel.findByUid((req.params.uid as ICustomer["uid"])).then((result) => {
        APISuccess(result)(res);
    });
}

function list(req: Request, res: Response)
{
    let limit = parseInt(req.query.limit as string)
    && parseInt(req.query.limit as string) <= 100 ? 
                                                            parseInt(req.query.limit as string) 
                                                            :
                                                            10;
    let page = 0;
    if(req.query)
    {
        if(req.query.page)
        {
            let p = parseInt(req.query.page as string);
            page = Number.isInteger(p) ? p : 0;
        }
    }

    API_CustomerModel.findAll(limit, page).then((result: any) => {
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
    API_CustomerModel.findAndPatch((req.params.uid as ICustomer["uid"]), req.body).then((result) => {
        APISuccess(result)(res);
    });
}

function removeById(req: Request, res: Response)
{
    API_CustomerModel.removeByUid(req.params.uid as ICustomer["uid"])
        .then((result)=>{
            APISuccess(result, 204)(res)
        });
};

function getMyProfile(req: Request, res: Response)
{
    // @ts-ignore
    API_CustomerModel.findByUid((req.payload.id as ICustomer["uid"])).then((result) => {
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