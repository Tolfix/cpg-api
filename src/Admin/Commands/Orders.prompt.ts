import inquirer from "inquirer";
import CustomerModel from "../../Database/Models/Customers/Customer.model";
import OrderModel from "../../Database/Models/Orders.model";
import ProductModel from "../../Database/Models/Products.model";
import PromotionCodeModel from "../../Database/Models/PromotionsCode.model";
import { currencyCodes } from "../../Lib/Currencies";
import { idOrder } from "../../Lib/Generator";
import Logger from "../../Lib/Logger";
import { A_CC_Payments, A_RecurringMethod } from "../../Types/PaymentMethod";
import dateFormat from "date-and-time";
import nextRycleDate from "../../Lib/Dates/DateCycle";
import mainEvent from "../../Events/Main.event";
import { sendEmail } from "../../Email/Send";
import NewOrderCreated from "../../Email/Templates/Orders/NewOrderCreated";
import { Company_Name } from "../../Config";
import { createInvoiceFromOrder } from "../../Lib/Orders/newInvoice";
import { sendInvoiceEmail } from "../../Lib/Invoices/SendEmail";

export default
{
    name: 'Orders',
    description: 'Get all invoice jobs',
    args: [
        {
            name: 'action',
            type: "list",
            message: "Select the cron you want to run",
            choices: [
                {
                    name: 'Get orders',
                    value: 'get_orders',
                },
                {
                    name: 'Get order',
                    value: 'get_order',
                },
                {
                    name: 'Create order',
                    value: 'create_order',
                }
            ],
        }
    ],
    method: async ({action}: {action: string}) => 
    {
        switch (action)
        {
            case 'get_orders':
                {
                    const orders = (await OrderModel.find());
                    Logger.info(orders);
                    break;
                }

            case 'get_order':
                {
                    const action = [
                        {
                            name: 'orderId',
                            type: 'input',
                            message: 'Enter the order id',
                        },
                    ]
                    const { orderId } = await inquirer.prompt(action);
    
                    Logger.info(`Order:`, await OrderModel.findOne({
                        id: orderId,
                    }));
                    break;
                }
            case 'create_order':
                {
                    const action1 = [
                        {
                            name: 'customer_uid',
                            type: 'search-list',
                            message: 'Customer',
                            choices: (await CustomerModel.find()).map(e =>
                                {
                                    return {
                                        name: `${e.personal.first_name} ${e.personal.last_name} (${e.id})`,
                                        value: e.id,
                                    }
                                })
                        },
                        {
                            name: 'payment_method',
                            type: 'search-list',
                            message: 'Enter the payment method',
                            choices: A_CC_Payments
                        },
                        {
                            name: 'currency',
                            type: 'search-list',
                            message: 'Enter the currency',
                            choices: [...currencyCodes, "Customer Currency"]
                        },
                        {
                            name: 'products',
                            type: 'search-checkbox',
                            message: 'Enter the products',
                            choices: (await ProductModel.find()).map(e =>
                            {
                                return {
                                    name: `${e.name} (${e.id})`,
                                    value: e.id,
                                }
                            }),
                        },
                    ]
                    
                    // eslint-disable-next-line prefer-const
                    let { currency, customer_uid, payment_method, products } = await inquirer.prompt(action1);

                    // @ts-ignore
                    const action2 = [...products.map(e =>
                        {
                            return {
                                name: `quantity_${e}`,
                                type: 'number',
                                message: `Enter the quantity for #${e}`,
                            }
                        }),
                        {
                            name: 'billing_type',
                            type: 'list',
                            message: 'Enter the billing type',
                            choices: [
                                {
                                    name: 'One time',
                                    value: 'one_time',
                                },
                                {
                                    name: 'Recurring',
                                    value: 'recurring',
                                }
                            ],
                        },
                        {
                            name: 'billing_cycle',
                            type: 'list',
                            message: 'Enter the billing cycle',
                            choices: A_RecurringMethod
                        },
                        {
                            name: "fees",
                            type: 'number',
                            message: 'Enter the fees',

                        },
                        {
                            name: "promotion_code",
                            type: 'search-list',
                            message: 'Enter the promotion code',
                            choices: [...(await PromotionCodeModel.find({
                                products_ids: {
                                    $in: products,
                                }
                            })).map(e =>
                            {
                                return {
                                    name: `${e.name} (${e.id})`,
                                    value: e.id,
                                }
                            }), {
                                name: 'None',
                                value: null,
                            }]
                        }
                    ]

                    const action2Result = await inquirer.prompt(action2);

                    // @ts-ignore
                    const newProduct = products.map(e =>
                        {
                            return {
                                product_id: e,
                                quantity: action2Result[`quantity_${e}`],
                            }
                        });

                    const customer = await CustomerModel.findOne({
                        id: customer_uid,
                    });

                    if (!customer)
                        throw new Error(`Fail to find customer with id: ${customer_uid}`);

                    const b_recurring = action2Result.billing_type === "recurring";
                    const newOrder = await (new OrderModel({
                        uid: idOrder(),
                        invoices: [],
                        currency: currency === "Customer Currency" ? customer.currency : currency,
                        customer_uid,
                        dates: {
                            createdAt: new Date(),
                            last_recycle: b_recurring ? dateFormat.format(new Date(), "YYYY-MM-DD") : undefined,
                            next_recycle: b_recurring ? dateFormat.format(nextRycleDate(new Date(), action2Result.billing_cycle), "YYYY-MM-DD") : undefined,
                        },
                        order_status: 'active',
                        payment_method,
                        products: newProduct,
                        billing_type: action2Result.billing_type,
                        billing_cycle: action2Result.billing_cycle,
                        fees: action2Result.fees,
                        promotion_code: action2Result.promotion_code,
                    }).save());

                    mainEvent.emit("order_created", newOrder);

                    await sendEmail({
                        receiver: customer.personal.email,
                        subject: `New order from ${await Company_Name() !== "" ? await Company_Name() : "CPG"} #${newOrder.id}`,
                        body: {
                            body: await NewOrderCreated(newOrder, customer)
                        }
                    });
                    
                    Logger.info(newOrder);

                    // Creating new invoice
                    const invoice = await createInvoiceFromOrder(newOrder);
                    await sendInvoiceEmail(invoice, customer);

                    newOrder.invoices.push(invoice.id);
                    await newOrder.save();

                    Logger.info(`Created new invoice:`, invoice);

                    break;
                }
            
        }
    }
};