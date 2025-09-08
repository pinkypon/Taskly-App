// components/table/task-table.tsx
'use client';
import { Button } from '@/components/button/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

export interface Task {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    completed: boolean;
    priority: 'Low' | 'Medium' | 'High';
}

export function TaskTable() {
    const { user, loading } = useAuth();
    const [data, setData] = React.useState<Task[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [totalCount, setTotalCount] = React.useState(0);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(5);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [editingRowId, setEditingRowId] = React.useState<number | null>(null);
    const [editedTask, setEditedTask] = React.useState<Partial<Task>>({});

    const saveTask = async () => {
        if (!editingRowId) return;

        try {
            const response = await axios.put(`/api/tasks/${editingRowId}`, editedTask);

            // Update local task list
            setData((prev) => prev.map((task) => (task.id === editingRowId ? response.data : task)));
            setEditingRowId(null); // Exit edit mode
            setEditedTask({});
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const columns = React.useMemo<ColumnDef<Task>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'title',
                header: 'Title',
                cell: ({ row }) => {
                    const isEditing = editingRowId === row.original.id;
                    return isEditing ? (
                        <Input
                            value={editedTask.title ?? ''}
                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                            className="w-full"
                        />
                    ) : (
                        <div>{row.original.title}</div>
                    );
                },
            },
            {
                accessorKey: 'description',
                header: 'Details',
                cell: ({ row }) => {
                    const isEditing = editingRowId === row.original.id;
                    return isEditing ? (
                        <textarea
                            value={editedTask.description ?? ''}
                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                            className="w-full rounded border p-1"
                        />
                    ) : (
                        <div>{row.original.description}</div>
                    );
                },
            },
            {
                accessorKey: 'due_date',
                header: 'Due Date',
                cell: ({ row }) => {
                    const isEditing = editingRowId === row.original.id;
                    const rawDate = row.getValue('due_date') as string | null;

                    if (isEditing) {
                        return (
                            <input
                                type="date"
                                value={editedTask.due_date ? editedTask.due_date.slice(0, 10) : ''}
                                onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                                className="rounded border p-1"
                            />
                        );
                    }

                    if (!rawDate) return <div>No due date</div>;
                    const parsedDate = new Date(rawDate);
                    return (
                        <div>
                            {!isNaN(parsedDate.getTime())
                                ? parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                : 'Invalid date'}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'priority',
                header: 'Priority',
                cell: ({ row }) => {
                    const isEditing = editingRowId === row.original.id;
                    return isEditing ? (
                        <select
                            value={editedTask.priority ?? ''}
                            onChange={(e) =>
                                setEditedTask({
                                    ...editedTask,
                                    priority: e.target.value as 'Low' | 'Medium' | 'High',
                                })
                            }
                            className="rounded border p-1 capitalize"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    ) : (
                        <div>{row.original.priority}</div>
                    );
                },
            },
            {
                accessorKey: 'completed',
                header: 'Status',
                cell: ({ row }) => {
                    const isEditing = editingRowId === row.original.id;
                    const completed = row.getValue('completed');

                    if (isEditing) {
                        return (
                            <select
                                key={row.original.id + '-completed'}
                                value={editedTask.completed ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditedTask({
                                        ...editedTask,
                                        completed: e.target.value === 'true',
                                    })
                                }
                                className="rounded border p-1"
                            >
                                <option value="true">Complete</option>
                                <option value="false">Unfinished</option>
                            </select>
                        );
                    }

                    return (
                        <div className={completed ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
                            {completed ? 'Complete' : 'Unfinished'}
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const task = row.original;
                    const isEditing = editingRowId === task.id;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-black">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-5 w-5 text-black" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {!isEditing ? (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setEditingRowId(task.id);
                                                setEditedTask({ ...task });
                                            }}
                                        >
                                            Edit Task
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => console.log('Delete task', task.id)}>Delete Task</DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onClick={saveTask}>Save</DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setEditingRowId(null);
                                                setEditedTask({});
                                            }}
                                        >
                                            Cancel
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [editingRowId, editedTask],
    );

    const table = useReactTable({
        data,
        columns,
        pageCount,
        manualPagination: true,
        onPaginationChange: (updater) => {
            const newState = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: { pageIndex, pageSize },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    React.useEffect(() => {
        async function fetchData() {
            try {
                const params = new URLSearchParams();
                params.append('page', String(pageIndex + 1));
                params.append('per_page', String(pageSize));

                if (sorting.length > 0) {
                    params.append('sort_by', sorting[0].id);
                    params.append('sort_order', sorting[0].desc ? 'desc' : 'asc');
                }

                const filterTitle = table.getColumn('title')?.getFilterValue();
                if (filterTitle) {
                    params.append('search', filterTitle as string);
                }

                const url = `/api/tasks?${params.toString()}`;
                const response = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json' } });
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Failed to fetch: ${response.status} ${text}`);
                }

                const result = await response.json();
                setData(result.data);
                setTotalCount(result.total);
                setPageCount(result.last_page);
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        }

        fetchData();
    }, [pageIndex, pageSize, sorting, columnFilters]);

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((col) => col.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
