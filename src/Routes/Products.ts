import { Application, Router } from "express";
import { CacheProduct } from "../Cache/CacheProduct";
import ProductModel from "../Database/Schemas/Products";
import { IProduct } from "../Interfaces/Products";
import { idProduct } from "../Lib/Generator";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

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

            if(payment_type !== "free" || payment_type !== "one_time" || payment_type !== "recurring")
                return APIError({
                    text: `'payment_type' didn't contain the following 'free', 'one_time', 'recurring'.`,
                    valids: ['free', 'one_time', 'recurring']
                })(res);

            if(!price)
                price = 0;

            if(typeof price !== "number")
                return APIError({
                    text: `'price' has to be a number`,
                })(res);
            
            if(!setup_fee)
                setup_fee = 0;

            if(typeof setup_fee !== "number")
                return APIError({
                    text: `'setup_fee' has to be a number`,
                })(res);

            if(!special)
                special = false;

            if(typeof special !== "boolean")
                return APIError({
                    text: `'special' has to be a boolean`,
                })(res);

            if(!stock)
                stock = 0;

            if(typeof stock !== "number")
                return APIError({
                    text: `'stock' has to be a number`,
                })(res);

            if(!BStock)
                BStock = false;

            if(typeof BStock !== "boolean")
                return APIError({
                    text: `'BStock' has to be a boolean`,
                })(res);

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