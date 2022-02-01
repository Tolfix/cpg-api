import { IOrder } from "@cpg/Interfaces/Orders.interface"
import { getSession } from "next-auth/react";
import { useState } from "react";
import { Modal } from "../../components/Modal";
import OrderTable from "../../components/Orders/Order.table";
import { IRowData } from "../../interfaces/RowData";

export async function CancelOrder(orderId: IOrder["id"])
{
    const session = await getSession();
    const token = session?.user?.email;

    if(!token)
        return Promise.resolve(false);

    const res = await fetch(`${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/customers/my/orders/${orderId}/cancel`,
    {
        method: 'POST',
        headers:
            {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
    });

    if(res.status === 200)
        return Promise.resolve(true);
    return Promise.resolve(false);
}

export default (
    {
        orders,
        count,
        pages
    }: {
        orders: IOrder[],
        count: number,
        pages: number,
    }
) =>
{
    const [openModal, setOpenModal] = useState(false);
    const [currentModalClicked, setCurrentModalClicked] = useState<null | IOrder["id"]>(null);

    const rowDataOrder: IRowData<IOrder>[] = [
        {
            id: "id",
            name: "Id",
            sortable: true,
            queryFormat: () =>
            {
                return "id";
            },
            printedPreview: (order: IOrder) =>
            {
                return `${order.id}`;
            }
        },
        {
            id: "date",
            name: "Date",
            sortable: true,
            queryFormat: () =>
            {
                return "dates.created_at";
            },
            printedPreview: (order: IOrder) =>
            {
                let date = (order.dates.createdAt).toString();
                if(!date)
                    date = "N/A";
                return `${date}`;
            }
        },
        {
            id: "status",
            name: "Status",
            sortable: true,
            queryFormat: () =>
            {
                return "status";
            },
            printedPreview: (order: IOrder) =>
            {
                return `${order.order_status}`;
            }
        },
        {
            id: "cancel",
            name: "Cancel",
            sortable: false,
            extra: true,
            queryFormat: () =>
            {
                return "cancel";
            },
            printedPreview: (order: IOrder) =>
            {
                return (
                    <>
                        {order.order_status !== "cancelled" && (
                            <>
                                <button onClick={() => 
                                    {
                                        setCurrentModalClicked(order.id);
                                        setOpenModal(true);
                                    }} id={`cancel-button-${order.id}`} className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </>
                )
            }
        }
    ]

    return (
        <>
            <div className="flex flex-wrap justify-center">
                <OrderTable count={count} pages={pages} orders={orders} rowData={rowDataOrder} />
                <Modal
                    onClose={() => setOpenModal(false)}
                    show={openModal}
                    title={`Cancel Order ${currentModalClicked}`}
                >
                    <p>Are you sure you want to cancel this order?</p>
                    <div className="flex flex-wrap">
                        <button
                            onClick={() => setOpenModal(false)}
                            className="px-5 m-2 rounded bg-red-400 hover:bg-red-600"
                        >
                            No
                        </button>
                        <button
                            onClick={() => 
                            {
                                if(currentModalClicked)
                                    CancelOrder(currentModalClicked)?.then(res =>
                                    {
                                        if(res)
                                            setOpenModal(false);
                                    });
                            }}
                            className="px-5 m-2 rounded bg-green-400 hover:bg-green-600"
                        >
                            Yes
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export async function getServerSideProps(context: any)
{
    const session = await getSession(context);
    // @ts-ignore
    const token = session?.user.email
    let query = ``;
    
    if(context.query)
    {
        query = `?${Object.keys(context.query).map(key => `${key}=${context.query[key]}`).join("&")}`;
    }
    let count, pages;
    const orders = await fetch(`${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/customers/my/orders${query}`,
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(res =>
    {
        count = res.headers.get("X-Total");
        pages = res.headers.get("X-Total-Pages");
        return res.json();
    });

    return {
        props: {
            orders,
            count,
            pages,
        }
    }
}