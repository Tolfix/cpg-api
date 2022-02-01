export interface IRowData<T>
{
    id: string;
    name: string;
    sortable: boolean;
    extra?: boolean;
    printedPreview: (data: T) => string | JSX.Element;
    queryFormat: () => string;
}