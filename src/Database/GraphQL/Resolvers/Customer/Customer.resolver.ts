import { ObjectTypeComposer, ResolverResolveParams, Resolver, schemaComposer } from "graphql-compose";
import { ICustomer } from "../../../../Interfaces/Customer.interface";
import CustomerModel from "../../../Models/Customers/Customer.model";
import InvoiceModel from "../../../Models/Invoices.model";
import OrderModel from "../../../Models/Orders.model";
import TransactionsModel from "../../../Models/Transactions.model";

export function myProfileResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myProfile",
        type: object.getType(),
        args: {},
        resolve: async <TSource, TContext, TArgs>({
            context,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        } & TContext, TArgs>) =>
        {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            const data = await CustomerModel.findOne({
                id: context.userData.id,
            });

            return data;
        }
    })
}

export function myInvoicesResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myInvoices",
        type: object.getType(),
        args: {},
        resolve: async <TSource, TContext, TArgs>({
            context,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        } & TContext, TArgs>) =>
        {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            const customer = await CustomerModel.findOne({
                id: context.userData.id,
            });

            if(!customer)
                throw new Error(`Customer not found`);

            const invoices = await InvoiceModel.find({
                $or: [
                    { customer_uid: customer.uid},
                    { customer_uid: customer.id}
                ]
            });

            return invoices;
        }
    })
}

export function myInvoiceResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myInvoice",
        type: object.getType(),
        args: {
            id: "String!"
        },
        resolve: async <TSource, TContext, TArgs>({
            args,
            context,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        } & TContext, {
            id: unknown
        } & TArgs>) =>
        {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            if(!args.id)
                throw new Error(`Invoice ID is required`);

            const customer = await CustomerModel.findOne({
                id: context.userData.id,
            });

            if(!customer)
                throw new Error(`Customer not found`);

            const invoice = await InvoiceModel.findOne({
                $or: [
                    {
                        customer_uid: customer.uid,
                        $or: [
                            {
                                id: args.id,
                            },
                            {
                                uid: args.id,
                            },
                            {
                                _id: args.id,
                            }
                        ]
                    },
                    {
                        customer_uid: customer.id,
                        $or: [
                            {
                                id: args.id,
                            },
                            {
                                uid: args.id,
                            },
                            {
                                _id: args.id,
                            }
                        ]
                    },
                ],
            });

            return invoice;
        }
    })
}

export function myOrdersResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myOrders",
        type: object.getType(),
        args: {},
        resolve: async <TSource, TContext, TArgs>({
            context,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        } & TContext, TArgs>) =>
        {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            const customer = await CustomerModel.findOne({
                id: context.userData.id,
            });

            if(!customer)
                throw new Error(`Customer not found`);

            const orders = await OrderModel.find({
                $or: [
                    { customer_uid: customer.uid},
                    { customer_uid: customer.id}
                ]
            });

            return orders;
        }
    })
}

export function myOrderResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myInvoice",
        type: object.getType(),
        args: {
            id: "String!"
        },
        resolve: async <TSource, TContext, TArgs>({
            args,
            context,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        } & TContext, {
            id: unknown
        } & TArgs>) =>
        {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            if(!args.id)
                throw new Error(`Order ID is required`);

            const customer = await CustomerModel.findOne({
                id: context.userData.id,
            });

            if(!customer)
                throw new Error(`Customer not found`);

            const order = await OrderModel.findOne({
                $or: [
                    {
                        customer_uid: customer.uid,
                        $or: [
                            {
                                id: args.id,
                            },
                            {
                                uid: args.id,
                            },
                            {
                                _id: args.id,
                            }
                        ]
                    },
                    {
                        customer_uid: customer.id,
                        $or: [
                            {
                                id: args.id,
                            },
                            {
                                uid: args.id,
                            },
                            {
                                _id: args.id,
                            }
                        ]
                    },
                ],
            });

            return order;
        }
    })
}

export function myTransactionsResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myOrders",
        type: object.getType(),
        args: {},
        resolve: async <TSource, TContext, TArgs>({
            context,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        } & TContext, TArgs>) =>
        {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            const customer = await CustomerModel.findOne({
                id: context.userData.id,
            });

            if(!customer)
                throw new Error(`Customer not found`);

            const transactions = await TransactionsModel.find({
                $or: [
                    { customer_uid: customer.uid},
                    { customer_uid: customer.id}
                ]
            });

            return transactions;
        }
    })
}

export function myTransactionResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myInvoice",
        type: object.getType(),
        args: {
            id: "String!"
        },
        resolve: async <TSource, TContext, TArgs>({
            args,
            context,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        } & TContext, {
            id: unknown
        } & TArgs>) =>
        {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            if(!args.id)
                throw new Error(`Transaction ID is required`);

            const customer = await CustomerModel.findOne({
                id: context.userData.id,
            });

            if(!customer)
                throw new Error(`Customer not found`);

            const transaction = await TransactionsModel.findOne({
                $or: [
                    {
                        customer_uid: customer.uid,
                        $or: [
                            {
                                id: args.id,
                            },
                            {
                                uid: args.id,
                            },
                            {
                                _id: args.id,
                            }
                        ]
                    },
                    {
                        customer_uid: customer.id,
                        $or: [
                            {
                                id: args.id,
                            },
                            {
                                uid: args.id,
                            },
                            {
                                _id: args.id,
                            }
                        ]
                    },
                ],
            });

            return transaction;
        }
    })
}