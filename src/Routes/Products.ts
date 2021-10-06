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

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/products", this.router);
        /**
         * Gets all products
         * @route GET /products
         * @group Products
         * @returns {Array} 200 - An array for products
         */
        this.router.get("/", (req, res) => {
            return APISuccess({
                products: CacheProduct.array(),
            })(res);
        });

        /**
         * Get specific product
         * @route GET /products/{uid}
         * @group Products
         * @param {string} uid.path.required - Uid for product
         * @returns {Object} 200 - The product data
         * @returns {Error} 400 - Failed to get product
         */
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

        /**
         * Creates a product
         * @route POST /products/create
         * @group Products
         * @param {string} category_uid.query.required - uid for category.
         * @param {string} description.query.required - description for product.
         * @param {boolean} hidden.query.required - Is hidden.
         * @param {string} payment_type.query - Payment type can be the following : "free" | "one_time" | "recurring".
         * @param {number} price.query - Price of product.
         * @param {string} recurring_method.query - Method of payment if recurring, then can be the following : "monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially"
         * @param {"monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially"} recurring_method.query - Method of payment if recurring
         * @param {string} product_name.query.required - Name of product.
         * @param {number} setup_fee.query - Setup fee.
         * @param {boolean} special.query - If a special product or not.
         * @param {number} stock.query - Stock number.
         * @param {boolean} BStock.query - Should stock be enabled.
         * @returns {Object} 200 - Created a new product.
         * @returns {Error} default - Missing something
         * @security JWT
         * @security Basic
         */
        this.router.post("/create", EnsureAdmin, (req, res) => {

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
            } = req.query as any;
            

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

        /**
         * Updates a product
         * @route PATCH /products/{uid}
         * @group Products
         * @param {string} uid.path.required - Uid for product
         * @param {string} category_uid.query - uid for category.
         * @param {string} description.query - description for product.
         * @param {boolean} hidden.query - Is hidden.
         * @param {string} payment_type.query - Payment type can be the following : "free" | "one_time" | "recurring".
         * @param {number} price.query - Price of product.
         * @param {string} recurring_method.query - Method of payment if recurring, then can be the following : "monthly" | "quarterly" | "semi_annually" | "biennially" | "triennially"
         * @param {string} product_name.query - Name of product.
         * @param {number} setup_fee.query - Setup fee.
         * @param {boolean} special.query - If a special product or not.
         * @param {number} stock.query - Stock number.
         * @param {boolean} BStock.query - Should stock be enabled.
         * @returns {Object} 200 - Updated product.
         * @returns {Error} default - Missing something
         * @security JWT
         * @security Basic
         */
        this.router.patch("/:uid", EnsureAdmin, async (req, res) => {
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
            } = req.query as any;

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

        /**
         * Creates a product
         * @route DELETE /products/{uid}
         * @group Products
         * @param {string} uid.path.required - Uid for product
         * @returns {Object} 200 - Deleted product.
         * @returns {Error} default - Something went wrong.
         * @security JWT
         * @security Basic
         */
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