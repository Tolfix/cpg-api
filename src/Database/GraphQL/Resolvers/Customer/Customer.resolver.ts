import {ObjectTypeComposer, Resolver, ResolverResolveParams, schemaComposer} from "graphql-compose";
import {ICustomer} from "@interface/Customer.interface";
import CustomerModel from "../../../Models/Customers/Customer.model";
import InvoiceModel from "../../../Models/Invoices.model";
import OrderModel from "../../../Models/Orders.model";
import TransactionsModel from "../../../Models/Transactions.model";

export function myProfileResolver(
    object: ObjectTypeComposer
): Resolver
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

            return CustomerModel.findOne({
                id: context.userData.id,
            });
        }
    })
}

export function myInvoicesResolver(
    object: ObjectTypeComposer
): Resolver
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

            return InvoiceModel.find({
                $or: [
                    {customer_uid: customer.uid},
                    {customer_uid: customer.id}
                ]
            });
        }
    })
}

export function myInvoiceResolver(
    object: ObjectTypeComposer
): Resolver
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

            return InvoiceModel.findOne({
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
        }
    })
}

export function myOrdersResolver(
    object: ObjectTypeComposer
): Resolver
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

            return OrderModel.find({
                $or: [
                    {customer_uid: customer.uid},
                    {customer_uid: customer.id}
                ]
            });
        }
    })
}

export function myOrderResolver(
    object: ObjectTypeComposer
): Resolver
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

            return OrderModel.findOne({
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
        }
    })
}

export function myTransactionsResolver(
    object: ObjectTypeComposer
): Resolver
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

            return TransactionsModel.find({
                $or: [
                    {customer_uid: customer.uid},
                    {customer_uid: customer.id}
                ]
            });
        }
    })
}

export function myTransactionResolver(
    object: ObjectTypeComposer
): Resolver
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

            return TransactionsModel.findOne({
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
        }
    })
}