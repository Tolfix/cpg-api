import { ITransactions } from "@cpg/Interfaces/Transactions.interface"
import { getSession } from "next-auth/react";

export default ({
    transactions
}: {
    transactions: ITransactions[]
}) =>
{
    return (
        <>
        
        </>
    )
}

export async function getServerSideProps(context: any)
{
    const session = await getSession(context);
    // @ts-ignore
    const token = session?.user.email

    const transactions = await fetch(`${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/customers/my/transactions`,
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(res => res.json());

    return {
        props: {
            transactions
        }
    }
}