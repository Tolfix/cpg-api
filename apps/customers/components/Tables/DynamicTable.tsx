import { useRouter } from "next/router";
import { IRowData } from "../../interfaces/RowData";
import Loading from "../Loading";
import useSortableData from "./Sortable";

export default function DynamicTable<T>(
    {
        data,
        rowData,
        path,
        count,
        pages,
    }: {
        data: Array<T>,
        // ! fix later !
        rowData: IRowData<any>[],
        path: string,
        count: number,
        pages: number,
    }
)
{

    if(!data)
        return (
            <>
                <Loading />
            </>
        )

    const router = useRouter();
    const skip = parseInt(router.query.skip as string) || 0;
    const limit = parseInt(router.query.limit as string) || 10;
    const currentPage = Math.floor(skip / limit) + 1;

    const changeNewPage = (newPage: number) =>
        window.location.href = `${path}?skip=${(newPage - 1) * limit}&limit=${limit}`;

    const changeNewLimit = (newLimit: number) =>
        window.location.href = `${path}?skip=${skip}&limit=${newLimit}`;
    
    const { items, requestSort, sortConfig } = useSortableData(data);

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

        return window.location.href = `/${path}?${option}=${search}`;
    }

    return (

        <div className="flex flex-col">
            {/* Search for different */}
            <div className='mt-5'>
                <form onSubmit={search} action="">
                    {/* Select for different categories */}
                    <select className='rounded' name="searchOption" id="">
                        {rowData.map((row) =>
                            (!row.extra && <>
                                <option key={row.id} value={row.queryFormat()} className='uppercase'>{row.name}</option>
                            </>)
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
                                {rowData.map(({id, name, sortable, extra}) => (
                                    (extra ? 
                                        (
                                            <>
                                            
                                                <th scope="col" className={`relative py-3 px-6`}>
                                                    <span className="sr-only">
                                                        {name}
                                                    </span>
                                                </th>

                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <th
                                                    key={id}
                                                    className={`
                                                        ${sortable ? 'cursor-pointer' : ''} 
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
                                            </>
                                        ) 
                                    )
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                                {items.map((data) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        {rowData.map(({id, printedPreview}) => (
                                            <td key={id} className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                {printedPreview(data)}
                                            </td>
                                        ))}
                                    </tr>                                       
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        {/* Pagination */}
                        <div className="">
                            {/* Pick limit selection */}
                            <div>
                                <select onChange={(event) =>
                                {
                                    changeNewLimit(parseInt(event.target.value));
                                }} className="rounded" name="limit" id="limit">
                                    {[10, 25, 50, 100].map((limit) =>
                                        // Check if limit is selected
                                        <option key={limit} value={limit} className='uppercase' selected={limit === parseInt(router.query.limit as string)}>{limit}</option>
                                    )}
                                </select>
                            </div>
                            <div className="flex justify-center items-center mt-2">
                                <div className="text-sm leading-5 text-gray-500">
                                    {/* Click to back page */}
                                    {skip !== 0 && (
                                        <>
                                            <button
                                                className="mr-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-
                                                600 rounded-lg text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                                                onClick={() => changeNewPage(currentPage - 1)}
                                            >
                                                Back                          
                                            </button>  
                                        </>
                                    )}
                                     
                                    <span>
                                        Showing
                                        <span className="px-1 text-xs font-medium leading-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            {skip + 1}
                                        </span>
                                        to
                                        <span className="px-1 text-xs font-medium leading-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            {skip + items.length}
                                        </span>
                                        of
                                        <span className="px-1 text-xs font-medium leading-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            {count}
                                        </span>
                                    </span>
                                    {/* Click to next page */}
                                    {/* Check if we can go any further */}
                                    {(skip + limit) < count && (
                                        <>
                                            <button
                                                className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-
                                                600 rounded-lg text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150
                                                "
                                                onClick={() => changeNewPage(currentPage + 1)}
                                            >
                                                Next                                            
                                            </button>
                                        </>
                                    )}                                       
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}