import { Application, Router } from "express";
import { CacheOrder } from "../Cache/CacheOrder";
import { IOrder } from "../Interfaces/Orders";
import { APIError, APISuccess } from "../Lib/Response";
import EnsureAdmin from "../Middlewares/EnsureAdmin";

export default class OrdersRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/oders", this.router);
        
        /**
         * Gets all orders
         * @route GET /orders
         * @group Orders
         * @returns {Array} 200 - An array of orders
         * @security JWT
         * @security Basic
         */
        this.router.get("/", EnsureAdmin, (req, res) => {
            return APISuccess({
                orders: CacheOrder.array(),
            })(res);
        });

        /**
         * Gets specific orders
         * @route GET /orders/{uid}
         * @group Orders
         * @param {string} uid.path.required - The uid of order.
         * @returns {Object} 200 - The order
         * @returns {Error} 400 - Unable to find by uid
         * @security JWT
         * @security Basic
         */        
        this.router.get("/:uid", EnsureAdmin, (req, res) => {
            const uid = req.params.uid as IOrder["uid"];

            const order = CacheOrder.get(uid);

            if(!order)
                return APIError({
                    text: `Unable to find order by uid ${uid}`,
                })(res);

            return APISuccess({
                order: order,
            })(res);
        });

        this.router.post("/create", EnsureAdmin, (req, res) => {
            
        });
    }
}