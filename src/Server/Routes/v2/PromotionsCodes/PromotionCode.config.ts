import { Application, Router } from "express";
import ProductModel from "../../../../Database/Models/Products.model";
import PromotionCodeModel from "../../../../Database/Models/PromotionsCode.model";
import Logger from "../../../../Lib/Logger";
import { APIError, APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import PromotionCodeController from "./PromotionCode.controller";
export = PromotionCodeRoute;
class PromotionCodeRoute
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/promotion_codes`, this.router);

        this.router.get("/", [
            EnsureAdmin(),
            PromotionCodeController.list
        ]);

        this.router.get("/:uid", [
            EnsureAdmin(),
            PromotionCodeController.getByUid
        ]);

        this.router.get("/:name/apply", async (req, res) =>
        {
            const name = req.params.name;
            const _products = req.body.products as number[];

            if(!_products)
                return APIError("Missing products", 400)(res);

            const products = await ProductModel.find({
                id: {
                    $in: _products
                }
            });

            const code = await PromotionCodeModel.findOne({ name: name });
            if(!code)
                return APIError(`Promotion code ${name} not found`, 404)(res);

            // Check if code is valid
            if(code.valid_to !== "permanent")
            // Convert string to date
            if(new Date(code.valid_to) < new Date())
            {
                Logger.debug(`Promotion code ${code.name} got invalid valid date`);
                return APIError(`Promotion code ${name} got invalid valid date`, 400)(res);
            }
        
            if(typeof code.valid_to === "string")
                if(code.uses <= 0)
                {
                    Logger.warning(`Promotion code ${code.name} has no uses left`);
                    return APIError(`Promotion code ${name} has no uses left`, 400)(res);
                }

            Logger.info(`Promotion code ${code.name} (${code.id}) is valid`);

            // Filter products which is not included in the promotion code
            const filtered_products = products.filter(product =>
            {
                if(code.products_ids.includes(product.id))
                {
                    Logger.info(`Promotion code ${code.name} (${code.id}) is valid for product ${product.id}`);
                    return true;
                }
                else
                {
                    Logger.info(`Promotion code ${code.name} (${code.id}) is not valid for product ${product.id}`);
                    return false;
                }
            });

            const new_changed_products = [];

            // Loop through each product
            for(const product of filtered_products)
            {
                if(code.products_ids.includes(product.id))
                {
                    Logger.info(`Promotion code ${code.name} (${code.id}) is valid for product ${product.id}`);
                    const o_price = product.price;
                    if(code.discount > 0)
                        product.price = product.price+(product.price*code.discount);
                    else
                        product.price = product.price - code.discount;
            
                    Logger.info(`New price of product ${product.id} is ${product.price}, old price was ${o_price}`);
                    // Check if we are - on price
                    if(product.price < 0)
                    {
                        Logger.error(`Product ${product.id} price is less than 0, making it "free" by setting it to 0`);
                        product.price = 0;
                    }
                    new_changed_products.push({
                        ...product,
                        o_price
                    });
                }
            }

            if(new_changed_products.length === 0)
                return APIError(`Promotion code ${name} is not valid for any of the products`, 400)(res);

            APISuccess(new_changed_products.map(p =>
            {
                return {
                    id: p.id,
                    new_price: p.price,
                    old_price: p.o_price
                }
            }))(res);
        });

        this.router.post("/", [
            EnsureAdmin(),
            PromotionCodeController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin(),
            PromotionCodeController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin(),
            PromotionCodeController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin(),
            PromotionCodeController.removeById
        ]);
    }

}