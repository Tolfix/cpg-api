import { IOrder } from "@ts/interfaces";
import { IRowData } from "../../interfaces/RowData";
import DynamicTable from "../Tables/DynamicTable";

export default function OrderTable<T extends Array<IOrder>>({
    orders,
    rowData,
    count,
    pages
}: {
    orders: T,
    // ! fix later !
    rowData: IRowData<any>[],
    count: number,
    pages: number,
})
{
    return (
        <DynamicTable count={count} pages={pages} path="/orders" data={orders} rowData={rowData} />
    )
}