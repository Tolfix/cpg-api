import { Application, Router } from "express";
import { CacheProduct } from "../Cache/CacheProduct";
import ProductModel from "../Database/Schemas/Products";
import { IProduct } from "../Interfaces/Products";
import AW from "../Lib/AW";
import { idProduct } from "../Lib/Generator";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";
import { isValidProduct } from "../Validator/ValidProducts";

export default class ProductRouter
{
    private server: Application;
    private router = Router();

    public name = "Product";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/products", this.router);
        
        this.router.get("/get/all", (req, res) => {
            return APISuccess({
                products: CacheProduct.array(),
            })(res);
        });

        this.router.get("/get/:uid", (req, res) => {
            const product = CacheProduct.get(req.params.uid);

            if(!product)
                return APIError({
                    text: `Unable to find product with id ${req.params.uid}`
                })(res);

            return APISuccess({
                product: product,
            })(res);
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

            let info: IProduct = {
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

            if(!hidden)
                info.hidden = false;

            if(!description)
                info.description = '';

            if(!payment_type)
                info.payment_type = "free";

            if(!price)
                info.price = 0;
            
            if(!setup_fee)
                info.setup_fee = 0;

            if(!special)
                info.special = false;

            if(!stock)
                info.stock = 0;

            if(!BStock)
                info.BStock = false;

            if(!isValidProduct(info, res))
                return;
            
            new ProductModel(info).save();
            CacheProduct.set(info.uid, info);

            return APISuccess({
                text: `Succesfully created product`,
                uid: info.uid,
                product: info,
            })(res);
        });

        this.router.patch("/patch/:uid", EnsureAdmin, async (req, res) => {
            // Check if product exists
            const uid = req.params.uid;
            let product = CacheProduct.get(uid);

            if(!product)
                return APIError({
                    text: `Couldn't find product with uid ${uid}`
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

            let info: IProduct = {
                uid: uid,
                category_uid: product.category_uid,
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

            if(!isValidProduct(info, res))
                return;

            if(product_name !== product.name)
                info.name = product_name;

            if(hidden !== product.hidden)
                info.hidden = hidden;

            if(description !== product.description)
                info.description = description;

            if(product.payment_type !== payment_type)
                info.payment_type = payment_type;

            if(product.price !== price)
                info.price = price;
            
            if(product.setup_fee !== setup_fee)
                info.setup_fee = setup_fee;

            if(product.special !== special)
                info.special = special;

            if(product.stock !== stock)
                info.stock = stock;

            if(product.BStock !== BStock)
                info.BStock = BStock;

            const [Succes, Fail] = await AW(ProductModel.updateOne({ uid: product.uid }, info));

            if(Fail)
                return APIError({
                    text: `Something went wrong, try again later.`,
                })(res);

            CacheProduct.set(info.uid, info);

            return APISuccess({
                text: `Succesfully updated ${info.uid}`,
                product: info,
            })(res);
        });

        this.router.delete("/delete/:uid", EnsureAdmin, async (req, res) => {
            const uid = req.params.uid;

            const product = CacheProduct.get(uid);

            if(!product)
                return APIError({
                    text: `Unable to find product with uid ${uid}`,
                })(res);

            const [Success, Fail] = await AW(ProductModel.deleteOne({ uid: uid }));

            if(Fail)
                return APIError({
                    text: `Something went wrong, try again later.`,
                })(res);

            CacheProduct.delete(uid);

            return APISuccess({
                text: `Succesfully removed product`,
                uid: uid,
            })(res);
        });
    }
}