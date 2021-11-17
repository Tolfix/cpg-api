import stripe from "stripe";
import { DebugMode, Stripe_SK_Live, Stripe_SK_Test } from "../Config";
import CustomerModel from "../Database/Schemas/Customer";
import ProductModel from "../Database/Schemas/Products";
import { IOrder } from "../Interfaces/Orders";
const Stripe = new stripe(DebugMode ? Stripe_SK_Test : Stripe_SK_Live, {
    apiVersion: "2020-08-27",
});

// Create a method that will create a payment intent from an order
export const CreatePaymentIntent = async (order: IOrder) => {
    const customer = await CustomerModel.findOne({ id: order.customer_uid });
    const Products = await ProductModel.find({ id: {
        $in: [...order.products.map(product => product.product_id)]
    } });

    return (await Stripe.paymentIntents.create({
        amount: order.price_override ? order.price_override : Products.reduce((acc, cur) => acc + cur.price, 0) ?? 0 * 100,
        currency: "usd",
        payment_method_types: ["card"],
        receipt_email: customer?.personal.email,
        // @ts-ignore
        description: "Order #" + order.id,
        metadata: {
            // @ts-ignore
            order_id: order.id,
            order_uid: order.uid,
        },
    }));
};