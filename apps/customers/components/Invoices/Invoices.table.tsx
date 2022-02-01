import {IInvoice} from '@ts/interfaces';
import { useSession } from 'next-auth/react';
import React, {useState} from 'react';
import useSortableData from '../Tables/Sortable';
import InvoiceModal, { popupCenter } from './Invoice.modal';

const InvoiceData = ({invoice}: { invoice: IInvoice }) =>
{
    const [showModal, setShowModal] = useState(false);
    const session = useSession();

    return (
        <>

            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {invoice.id}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {invoice.dates?.invoice_date.toString().replaceAll("-", "") || "?"}{invoice.id}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {invoice.dates?.due_date.toString().replaceAll("-", " ") || "?"}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    { (invoice.amount + ((invoice.amount / 100) * invoice.tax_rate)).toString()}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {invoice.paid ? "Yes" : "No"}
                </td>
                <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                    <button onClick={() => setShowModal(true)} className='text-indigo-600 hover:text-indigo-900'>
                        View
                    </button>
                </td>
                <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                    <button onClick={() =>
                    {
                        return popupCenter({
                            url: `${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/customers/my/invoices/${invoice.id}/preview?access_token=${session?.data?.user?.email}`,
                            title: "Invoice Preview",
                            w: 1200,
                            h: 1000
                        });
                    }} className='text-indigo-600 hover:text-indigo-900'>
                        Preview
                    </button>
                </td>
            </tr>

            <InvoiceModal show={showModal} setShow={setShowModal} invoice={invoice}/>
        </>
    )
}

const InvoiceTable = ({
                          invoice
                      }: {
    invoice: IInvoice[]
}) =>
{
    const {items, requestSort, sortConfig} = useSortableData(invoice);
    const isSelected = (name: string) =>
    {
        if (!sortConfig)
            return;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    const search = async (event: { preventDefault: () => void; target: any; }) =>
    {
        event.preventDefault();
        const form = event.target;
        const option = form.searchOption.value;
        const search = form.search.value;

        if(option === "dates.invoice_date&id")
        {
            // parse the search, and get the invoice id and date
            // YYMMDDID
            // Get id by removing the first 8 characters
            const id = search.substring(8);
            const date = search.substring(0, 4) + "-" + search.substring(4, 6) + "-" + search.substring(6, 8);
            return window.location.href = `/invoices?dates.invocie_date=${date}&id=${id}`;
        }

        return window.location.href = `/invoices?${option}=${search}`;
    }

    const rowData = [
        {
            id: 'id',
            name: "Id",
            sortable: true,
            queryFormat: () =>
            {
                return "id";
            },
        },
        {
            id: "ocr",
            name: "OCR",
            sortable: true,
            queryFormat: () =>
            {
                return "dates.invoice_date&id";
            },
        },
        {
            id: "due_date",
            name: "Due Date",
            sortable: false,
            queryFormat: () =>
            {
                return "dates.invoice_date";
            },
        },
        {
            id: "amount",
            name: "Amount",
            sortable: true,
            queryFormat: () =>
            {
                return "amount";
            },
        },
        {
            id: "paid",
            name: "Paid",
            sortable: true,
            queryFormat: () =>
            {
                return "paid";
            },
        },
    ]

    return (
        <div className="flex flex-col">
            {/* Search for different */}
            <div className='mt-5'>
                <form onSubmit={search} action="">
                    {/* Select for different categories */}
                    <select className='rounded' name="searchOption" id="">
                        {rowData.map((row) =>
                            <option key={row.id} value={row.queryFormat()} className='uppercase'>{row.name}</option>
                        )}
                    </select>
                    {/* Input for what to search */}
                    <input className='rounded bg-gray-200 focus:bg-gray-100' type="text" name='search' />
                    {/* Button to search */}
                    <button type='submit' className='bg-purple-300 hover:bg-purple-400 rounded px-2'>Search</button>
                </form>
            </div>
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-md sm:rounded-lg">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {rowData.map(({id, name, sortable}) => (
                                    <th
                                        key={id}
                                        className={`${sortable ? 'cursor-pointer' : ''} 
                                        border-b border-gray-200 dark:border-gray-600 text-left 
                                        py-4 px-6 font-medium text-xs 
                                        text-gray-500 uppercase tracking-wider
                                        ${isSelected(id) === "ascending" ? `bg-gray-200` : ``}
                                        `}
                                        onClick={() => sortable && requestSort(id)}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => requestSort(id)}
                                        >
                                            {name}
                                        </button>
                                    </th>
                                ))}
                                <th scope="col" className={`relative py-3 px-6`}>
                                    <span className="sr-only">
                                        More
                                    </span>
                                </th>
                                <th scope="col" className={`relative py-3 px-6`}>
                                    <span className="sr-only">
                                        Preview
                                    </span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                {items.map((invoice) => (
                                    <InvoiceData key={invoice.id} invoice={invoice}/>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ({
                    invoice
                }: {
    invoice: IInvoice[]
}) =>
{
    return (
        <InvoiceTable
            invoice={invoice}
        />
    );
}