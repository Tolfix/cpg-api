import { Application, Router } from "express";
import { CacheProduct } from "../Cache/CacheProduct";
import ProductModel from "../Database/Schemas/Products";
import { IProduct } from "../Interfaces/Products";
import { idProduct } from "../Lib/Generator";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";
import EnsureAuth from "../Middlewares/EnsureAuth";

export default class ProductRouter
{
    private server: Application;
    private router = Router();

    public name = "Product";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/product", this.router);
        
        this.router.get("/get/all", (req, res) => {

        });

        this.router.post("/post/create", EnsureAdmin, (req, res) => {

            const cUid = req.body.category_uid;

            if(!cUid)
                return APIError({
                    text: `Missing 'category_uid' in body.`,
                })(res);

            let {
                description,
                hidden,
                payment_type,
                price,
                recurring_method,
                product_name,
                setup_fee,
                special,
                stock,
                BStock
            } = req.body;

            if(!product_name)
                return APIError({
                    text: `Missing 'product_name' in body.`,
                })(res);

            if(!hidden)
                hidden = false;

            if(!description)
                description = '';

            if(!payment_type)
                payment_type = "free";

            if(!price)
                price = 0;
            
            if(!setup_fee)
                setup_fee = 0;

            if(!special)
                special = false;

            if(!stock)
                stock = 0;

            if(!BStock)
                BStock = false;

            const info: IProduct = {
                uid: idProduct().toString(),
                category_uid: cUid,
                description,
                hidden,
                name: product_name,
                payment_type,
                price,
                recurring_method,
                setup_fee,
                special,
                stock,
                BStock
            };

            new ProductModel(info).save();
            CacheProduct.set(info.uid, info);

            APISuccess({
                text: `Succesfully created product`,
                product: info,
            })(res);
        });

        this.router.patch("/patch/:uid", EnsureAdmin, (req, res) => {

        });
    }
}