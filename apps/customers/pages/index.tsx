import type { NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loading from "../components/Loading";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { IInvoice, IOrder, ITransactions, ICustomer } from '@ts/interfaces';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// @ts-ignore
const Home: NextPage = ({
    invoices,
    orders,
    transactions,
}: {
    invoices: IInvoice[],
    orders: IOrder[],
    transactions: ITransactions[],
}) =>
{
    const session = useSession();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = session.data?.user.email
    const [customer, setCustomer] = useState<ICustomer | null>(null);

    useEffect(() =>
    {
        fetch(`${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/customers/my/profile`,
            {
                method: 'GET',
                headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
            }).then(res => res.json()).then(data =>
        {
            setCustomer(data);
        });
    }, []);

    if (!customer)
        return (
            <>
                <Loading/>
            </>
        )

    return (
        <>

            {/* Customer portal, with tailwind */}
            <div className="flex flex-col justify-center items-center mt-32 w-screen">
                <div className="max-w-xs">
                    <div className="text-center">
                        <div className="text-gray-700 text-xl font-bold">
                            Welcome {customer.personal.first_name} {customer.personal.last_name}
                        </div>
                    </div>
                </div>
                <div>
                    <Bar 
                    data={{
                        labels: [""],
                        datasets: [
                            {
                                label: "Invoices",
                                data: [invoices.length],
                                backgroundColor: [
                                    '#FF6384',
                                ],
                                hoverBackgroundColor: [
                                    '#FF6384',
                                ],
                            },
                            {
                                label: "Orders",
                                data: [orders.length],
                                backgroundColor: [
                                    '#A855F7',
                                ],
                                hoverBackgroundColor: [
                                    '#A855F7',
                                ],
                            },
                            {
                                label: "Transactions",
                                data: [transactions.length],
                                backgroundColor: [
                                    '#36A2EB',
                                ],
                                hoverBackgroundColor: [
                                    '#36A2EB',
                                ],
                            }
                        ],
                        
                    }} />
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context: any)
{
    const session = await getSession(context);
    // @ts-ignore
    const token = session?.user.email
    if(!token)
        return {
            props: {}
        };

    const [invoices, orders, transactions] = [
        await fetch(`${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/customers/my/invoices&limit=100`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => res.json()),
        await fetch(`${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/customers/my/orders&limit=100`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => res.json()),
        await fetch(`${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/customers/my/transactions&limit=100`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => res.json()),
    ];

    return {
        props: {
            invoices: invoices,
            orders: orders,
            transactions: transactions,
        }
    }
}
export default Home;

