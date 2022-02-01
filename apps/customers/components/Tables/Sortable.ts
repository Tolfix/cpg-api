import React from "react";

export default function useSortableData<T>(items: T[], config = null)
{
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: 'ascending' | 'descending';
    } | null>(config);

    const sortedItems = React.useMemo(() =>
    {
        const sortableItems = [...items];
        if (sortConfig !== null)
        {
            sortableItems.sort((a, b) =>
            {
                // @ts-ignore
                if (a[sortConfig.key] < b[sortConfig.key])
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                // @ts-ignore
                if (a[sortConfig.key] > b[sortConfig.key])
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    // @ts-ignore
    const requestSort = (key) =>
    {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        )
            direction = 'descending';
        // @ts-ignore
        setSortConfig({key, direction});
    };

    return {items: sortedItems, requestSort, sortConfig};
}