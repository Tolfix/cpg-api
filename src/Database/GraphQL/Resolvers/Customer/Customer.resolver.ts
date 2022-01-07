import { ObjectTypeComposer, ResolverResolveParams, Resolver, schemaComposer } from "graphql-compose";
import { ICustomer } from "../../../../Interfaces/Customer";
import CustomerModel from "../../../Models/Customers/Customer";
import InvoiceModel from "../../../Models/Invoices";
import OrderModel from "../../../Models/Orders";

export function myProfileResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myProfile",
        type: object.getType(),
        args: {},
        resolve: async <TSource, TContext, TArgs>({
            source,
            args,
            context,
            info,
            projection,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        }, TArgs>) => {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            const data = await CustomerModel.findOne({
                id: context.userData.id,
            });

            return data;
        }
    })
};

export function myInvoicesResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myInvoices",
        type: object.getType(),
        args: {},
        resolve: async <TSource, TContext, TArgs>({
            source,
            args,
            context,
            info,
            projection,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        }, TArgs>) => {
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
};

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
            source,
            args,
            context,
            info,
            projection,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        }, {
            id: unknown
        }>) => {
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
};

export function myOrdersResolver(
    object: ObjectTypeComposer
): Resolver<any, any, any, any>
{
    return schemaComposer.createResolver({
        name: "myOrders",
        type: object.getType(),
        args: {},
        resolve: async <TSource, TContext, TArgs>({
            source,
            args,
            context,
            info,
            projection,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        }, TArgs>) => {
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
};

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
            source,
            args,
            context,
            info,
            projection,
        }: ResolverResolveParams<TSource, {
            isAdmin: boolean;
            isUser: boolean;
            userData: {
                id: ICustomer["id"],
                email: ICustomer["personal"]["email"],
            }
        }, {
            id: unknown
        }>) => {
            if(context.isAdmin)
                throw new Error(`Admin not allowed to access this`);

            if(!args.id)
                throw new Error(`Invoice ID is required`);

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
};