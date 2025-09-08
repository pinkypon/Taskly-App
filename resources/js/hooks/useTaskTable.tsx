// src/hooks/useTaskTable.ts
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSelectedRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type RowSelectionState,
    type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

export function useTaskTable<TData>(data: TData[], columns: ColumnDef<TData>[]) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            rowSelection,
        },
        enableRowSelection: true,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSelectedRowModel: getSelectedRowModel(),
    });

    return table;
}
