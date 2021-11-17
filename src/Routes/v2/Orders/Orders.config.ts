import { Application, Router } from "express";
import CustomerModel from "../../../Database/Schemas/Customer";
import OrderModel from "../../../Database/Schemas/Orders";
import ProductModel from "../../../Database/Schemas/Products";
import { IPayments } from "../../../Interfaces/Payments";
import { IProduct } from "../../../Interfaces/Products";
import { APIError, APISuccess } from "../../../Lib/Response";
import EnsureAdmin from "../../../Middlewares/EnsureAdmin";
import OrderController from "./Orders.controller";
import dateFormat from "date-and-time";
import nextRecycleDate from "../../../Lib/Dates/DateCycle";
import { createInvoiceFromOrder } from "../../../Lib/Orders/newInvoice";
import { idOrder } from "../../../Lib/Generator";
import { Full_Domain } from "../../../Config";
import { sendInvoiceEmail } from "../../../Lib/Invoices/SendEmail";
import EnsureAuth from "../../../Middlewares/EnsureAuth";


export default class OrderRoute
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/orders`, this.router);

        this.router.get("/", [
            EnsureAdmin,
            OrderController.list
        ]);

        this.router.post("/place", EnsureAuth, async (req, res) => {
            // @ts-ignore
            const customer_id = req.customer.id;
            const products = req.body as Array<{
                product_id: IProduct["id"],
                quantity: number
            }>;
            const payment_method = req.body as keyof IPayments;

            if(!customer_id || !products || !payment_method)
                return APIError("Missing in body")(res);

            if(!payment_method.match(/manual|bank|paypal|credit_card|swish/g))
                return APIError("payment_method invalid")(res);

            // Check if customer_id is valid
            const customer = await CustomerModel.findOne({ id: customer_id });

            if(!customer)
                return APIError("Unable to find customer")(res);

            const _products = await ProductModel.find({
                id: {
                    $in: products.map(product => product.product_id)
                }
            });

            if(_products.length <= 0)
                return APIError("No valid products ids")(res);

            // Create new order
            const order = await (new OrderModel({
                customer_id: customer.id,
                products: _products.map(product => {
                    return {
                        product_id: product.id,
                        quantity: products.find(p => p.product_id === product.id)?.quantity ?? 1
                    }
                }),
                payment_method: payment_method,
                order_status: "active",
                billing_type: "recurring",
                billing_cycle: "monthly",
                quantity: 1,
                dates: {
                    createdAt: new Date(),
                    next_recycle: dateFormat.format(nextRecycleDate(
                        new Date(), "monthly")
                    , "YYYY-MM-DD"),
                    last_recycle: dateFormat.format(new Date(), "YYYY-MM-DD")
                },
                uid: idOrder(),
            }).save());

            const invoice = await createInvoiceFromOrder(order);

            order.invoices.push(invoice.id);
            await order.save();

            await sendInvoiceEmail(invoice, customer);

            if(!invoice)
                return APIError("Unable to create invoice")(res);

            if(payment_method === "paypal")
                return APISuccess(`${Full_Domain}/v2/paypal/pay/${invoice.uid}`)(res);

            return APISuccess(`Invoice sent.`);
        });

        this.router.get("/:uid", [
            EnsureAdmin,
            OrderController.getByUid
        ]);

        this.router.post("/", [
            EnsureAdmin,
            OrderController.insert
        ]);

        this.router.patch("/:uid", [
            EnsureAdmin,
            OrderController.patch
        ]);

        this.router.put("/:uid", [
            EnsureAdmin,
            OrderController.patch
        ]);

        this.router.delete("/:uid", [
            EnsureAdmin,
            OrderController.removeById
        ]);

    }

}