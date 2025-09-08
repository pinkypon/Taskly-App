'use client';

import { Button } from '@/components/button/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { format, parseISO } from 'date-fns';
import { ArrowUpDown, CheckCircle, ChevronDown, Edit, MoreHorizontal, Save, Trash2, X, XCircle } from 'lucide-react';
import * as React from 'react';
import axios from '../lib/axios';

export type Task = {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    completed: boolean;
    priority: 'Low' | 'Medium' | 'High';
};

type BulkAction = 'complete' | 'incomplete' | 'delete';

type EditableTitleCellProps = {
    rowId: string;
    title: string;
    isEditing: boolean;
    onChange: (value: string) => void;
    onToggleEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
};

const EditableRow = ({
    row,
    tempEdit,
    onChange,
    onSave,
    onCancel,
}: {
    row: Task;
    tempEdit: Partial<Task>;
    onChange: (field: keyof Task, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
}) => {
    return (
        <>
            {/* Select checkbox cell */}
            <TableCell className="w-[50px]"></TableCell>

            {/* Title cell */}
            <TableCell className="font-medium">
                <Input
                    value={tempEdit.title ?? row.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    className="h-8 w-full border-input bg-background text-foreground focus:border-ring focus:ring-ring"
                />
            </TableCell>

            {/* Description cell */}
            <TableCell>
                <Input
                    value={tempEdit.description ?? row.description ?? ''}
                    onChange={(e) => onChange('description', e.target.value)}
                    className="h-8 w-full border-input bg-background text-foreground focus:border-ring focus:ring-ring"
                />
            </TableCell>

            {/* Completed cell (dropdown) */}
            <TableCell className="text-center">
                <select
                    value={String(tempEdit.completed ?? (row.completed ? 1 : 0))}
                    onChange={(e) => onChange('completed', e.target.value === '1' ? 1 : 0)}
                    className="h-8 w-full max-w-[60px] rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>
            </TableCell>

            {/* Due Date cell (input) */}
            <TableCell className="flex justify-center">
                <Input
                    type="date"
                    value={tempEdit.due_date ?? row.due_date ?? ''}
                    onChange={(e) => onChange('due_date', e.target.value)}
                    className="h-8 w-full max-w-[140px] border-input bg-background text-foreground focus:border-ring focus:ring-ring"
                />
            </TableCell>

            {/* Priority cell */}
            <TableCell>
                <div className="flex justify-center">
                    <select
                        value={tempEdit.priority ?? row.priority}
                        onChange={(e) => onChange('priority', e.target.value)}
                        className="h-8 max-w-[90px] rounded-md border border-input bg-background px-1 py-1 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </TableCell>

            {/* Actions cell */}
            <TableCell className="w-[80px]">
                <div className="flex justify-center gap-2">
                    <Button size="sm" variant="ghost" onClick={onSave} className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground">
                        <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </>
    );
};

const EditableTitleCell = React.memo(({ rowId, title, isEditing, onChange, onToggleEdit, onSave, onCancel }: EditableTitleCellProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
        },
        [onChange],
    );

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                onSave();
            } else if (e.key === 'Escape') {
                onCancel();
            }
        },
        [onSave, onCancel],
    );

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    ref={inputRef}
                    value={title}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="h-8 flex-1 border-input bg-background text-foreground focus:border-ring focus:ring-ring"
                />
                <Button size="sm" variant="ghost" onClick={onSave} className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground">
                    <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className="flex-1 font-medium">{title}</span>
            <Button size="sm" variant="ghost" onClick={onToggleEdit} className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground">
                <Edit className="h-4 w-4" />
            </Button>
        </div>
    );
});
EditableTitleCell.displayName = 'EditableTitleCell';

export function DataTableDemo() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [data, setData] = React.useState<Task[]>([]);

    // Bulk action confirmation dialog state
    const [bulkActionDialog, setBulkActionDialog] = React.useState<{
        isOpen: boolean;
        action: BulkAction | null;
        selectedCount: number;
    }>({
        isOpen: false,
        action: null,
        selectedCount: 0,
    });

    React.useEffect(() => {
        axios
            .get('/api/tasks')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error('Error fetching tasks:', err);
            });
    }, []);

    // Track which rows are being edited and their temporary values
    const [editingRows, setEditingRows] = React.useState<Set<string>>(new Set());
    const [tempEdits, setTempEdits] = React.useState<Record<string, Partial<Task>>>({});

    const handleToggleEdit = React.useCallback(
        (rowId: string) => {
            setEditingRows((prev) => new Set([...prev, rowId]));
            const currentRow = data.find((row) => row.id === rowId);
            if (currentRow) {
                setTempEdits((prev) => ({
                    ...prev,
                    [rowId]: {
                        title: currentRow.title,
                        description: currentRow.description,
                        due_date: currentRow.due_date,
                        priority: currentRow.priority,
                    },
                }));
            }
        },
        [data],
    );

    const handleStartEdit = React.useCallback(
        (rowId: string) => {
            const task = data.find((t) => t.id === rowId);
            if (task) {
                setEditingRows((prev) => new Set(prev).add(rowId));
                setTempEdits((prev) => ({
                    ...prev,
                    [rowId]: {
                        title: task.title,
                        description: task.description ?? '',
                        due_date: task.due_date ?? '',
                        priority: task.priority ?? 'Medium',
                    },
                }));
            }
        },
        [data],
    );

    const handleTempEdit = React.useCallback((rowId: string, field: keyof Task, value: any) => {
        setTempEdits((prev) => ({
            ...prev,
            [rowId]: {
                ...prev[rowId],
                [field]: value,
            },
        }));
    }, []);

    const handleSaveEdit = React.useCallback(
        async (rowId: string) => {
            const tempEdit = tempEdits[rowId];
            if (!tempEdit) return;

            try {
                await axios.put(`/api/tasks/${rowId}`, tempEdit);
                setData((prev) => prev.map((row) => (row.id === rowId ? { ...row, ...tempEdit } : row)));
            } catch (error) {
                console.error('Failed to update task:', error);
            }

            setEditingRows((prev) => {
                const newSet = new Set(prev);
                newSet.delete(rowId);
                return newSet;
            });

            setTempEdits((prev) => {
                const { [rowId]: _, ...rest } = prev;
                return rest;
            });
        },
        [tempEdits],
    );

    const handleCancelEdit = React.useCallback((rowId: string) => {
        // Clear editing state without saving
        setEditingRows((prev) => {
            const newSet = new Set(prev);
            newSet.delete(rowId);
            return newSet;
        });
        setTempEdits((prev) => {
            const { [rowId]: _, ...rest } = prev;
            return rest;
        });
    }, []);

    // Bulk action handlers
    const getSelectedRowIds = (): string[] => {
        return Object.keys(rowSelection).filter((id) => rowSelection[id]);
    };

    const handleBulkAction = (action: BulkAction) => {
        const selectedIds = getSelectedRowIds();
        if (selectedIds.length === 0) return;

        setBulkActionDialog({
            isOpen: true,
            action,
            selectedCount: selectedIds.length,
        });
    };

    const refreshData = React.useCallback(async () => {
        try {
            const response = await axios.get('/api/tasks');
            setData(response.data);
            console.log('Data refreshed from server:', response.data);
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    }, []);

    const confirmBulkAction = async () => {
        const { action } = bulkActionDialog;
        const selectedIds = getSelectedRowIds();

        if (!action || selectedIds.length === 0) return;

        console.log('Bulk action:', action, 'Selected IDs:', selectedIds);

        try {
            switch (action) {
                case 'complete':
                    console.log('Marking tasks as complete...');
                    await Promise.all(
                        selectedIds.map(async (id) => {
                            console.log(`Updating task ${id} to completed: 1`);
                            const response = await axios.put(`/api/tasks/${id}`, { completed: 1 });
                            console.log(`Response for task ${id}:`, response.data);
                            return response;
                        }),
                    );
                    break;

                case 'incomplete':
                    console.log('Marking tasks as incomplete...');
                    await Promise.all(
                        selectedIds.map(async (id) => {
                            console.log(`Updating task ${id} to completed: 0`);
                            const response = await axios.put(`/api/tasks/${id}`, { completed: 0 });
                            console.log(`Response for task ${id}:`, response.data);
                            return response;
                        }),
                    );
                    break;

                case 'delete':
                    console.log('Deleting tasks...');
                    await Promise.all(
                        selectedIds.map(async (id) => {
                            console.log(`Deleting task ${id}`);
                            const response = await axios.delete(`/api/tasks/${id}`);
                            console.log(`Delete response for task ${id}:`, response.status);
                            return response;
                        }),
                    );
                    break;
            }

            // Refresh data from server after successful bulk action
            console.log('Refreshing data from server...');
            await refreshData();

            // Clear selection after successful action
            console.log('Clearing row selection...');
            setRowSelection({});
            console.log('Bulk action completed successfully');
        } catch (error: any) {
            console.error(`Failed to ${action} tasks:`, error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
        }

        setBulkActionDialog({ isOpen: false, action: null, selectedCount: 0 });
    };

    const cancelBulkAction = () => {
        setBulkActionDialog({ isOpen: false, action: null, selectedCount: 0 });
    };

    const getActionMessage = () => {
        const { action, selectedCount } = bulkActionDialog;

        switch (action) {
            case 'complete':
                return `Are you sure you want to mark ${selectedCount} task${selectedCount > 1 ? 's' : ''} as completed?`;
            case 'incomplete':
                return `Are you sure you want to mark ${selectedCount} task${selectedCount > 1 ? 's' : ''} as incomplete?`;
            case 'delete':
                return `Are you sure you want to delete ${selectedCount} task${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`;
            default:
                return '';
        }
    };

    const getActionTitle = () => {
        const { action } = bulkActionDialog;

        switch (action) {
            case 'complete':
                return 'Mark as Completed';
            case 'incomplete':
                return 'Mark as Incomplete';
            case 'delete':
                return 'Delete Tasks';
            default:
                return '';
        }
    };

    const columns = React.useMemo<ColumnDef<Task>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'title',
                header: 'Title',
                cell: ({ row }) => {
                    const value = row.getValue('title') as string;
                    return <div className="max-w-[200px] truncate font-medium">{value}</div>;
                },
            },
            {
                accessorKey: 'description',
                header: 'Description',
                cell: ({ row }) => {
                    const value = row.getValue('description') as string;
                    return (
                        <div className="max-w-[300px] truncate text-muted-foreground" title={value || '—'}>
                            {value || '—'}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'completed',
                header: ({ column }) => (
                    <div className="w-full text-center">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                const current = column.getIsSorted();
                                if (current === false)
                                    column.toggleSorting(false); // → asc
                                else if (current === 'asc')
                                    column.toggleSorting(true); // → desc
                                else column.clearSorting(); // → none
                            }}
                            className="mx-auto"
                        >
                            Completed
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                ),
                cell: ({ row }) => {
                    const value = row.getValue('completed');
                    const isCompleted = value === true || value === 1 || value === '1';

                    return (
                        <div className={`text-center text-sm ${isCompleted ? 'text-green-600' : 'text-red-600'}`}>{isCompleted ? 'Yes' : 'No'}</div>
                    );
                },
            },
            {
                accessorKey: 'due_date',
                header: () => <div className="text-center">Due Date</div>,
                cell: ({ row }) => {
                    const rawValue = row.getValue('due_date') as string;
                    return <div className="text-center font-medium">{rawValue ? format(parseISO(rawValue), 'MMM d, yyyy') : '—'}</div>;
                },
            },
            {
                accessorKey: 'priority',
                header: () => <div className="text-center">Priority</div>,
                cell: ({ row }) => {
                    const value = row.getValue('priority') as string;

                    const getPriorityColor = (priority: string) => {
                        switch (priority.toLowerCase()) {
                            case 'high':
                                return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/50 dark:border-red-900';
                            case 'medium':
                                return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/50 dark:border-yellow-900';
                            case 'low':
                                return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/50 dark:border-green-900';
                            default:
                                return 'text-foreground';
                        }
                    };

                    return (
                        <div className="text-center">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(value)}`}>
                                {value}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: () => <div className="text-center">Actions</div>,
                enableHiding: false,
                cell: ({ row }) => {
                    const task = row.original;

                    return (
                        <div className="flex items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                        Edit
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-border bg-popover text-popover-foreground">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(task.id.toString())}
                                        className="hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Copy Task ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem
                                        onClick={() => handleStartEdit(task.id)}
                                        className="hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Edit Task
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [editingRows, tempEdits, handleToggleEdit, handleSaveEdit, handleCancelEdit, handleStartEdit, handleTempEdit],
    );

    const table = useReactTable({
        data,
        columns,
        getRowId: (row) => row.id,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const selectedRowCount = Object.keys(rowSelection).filter((id: string) => rowSelection[id]).length;

    return (
        <div className="w-full space-y-4 bg-background p-4 text-foreground">
            {/* Filter and Column Visibility Controls */}
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Filter title..."
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
                    className="max-w-sm border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="ml-auto border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-border bg-popover text-popover-foreground">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize hover:bg-accent hover:text-accent-foreground"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/* Bulk Actions Bar */}
            {selectedRowCount > 0 && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">
                        {selectedRowCount} row{selectedRowCount > 1 ? 's' : ''} selected
                    </span>
                    <div className="ml-auto flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('complete')}
                            className="h-8 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-900/50"
                        >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Mark Complete
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('incomplete')}
                            className="h-8 border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                        >
                            <XCircle className="mr-1 h-4 w-4" />
                            Mark Incomplete
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('delete')}
                            className="h-8 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            )}
            {/* Table */}
            <div className="rounded-md border border-border bg-background">
                <Table>
                    <TableHeader className="bg-indigo-600">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-border hover:bg-muted/50">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-medium text-muted-foreground">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => {
                                const isEditing = editingRows.has(row.id);
                                const tempEdit = tempEdits[row.id] ?? {};

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className="border-b border-border hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        {isEditing ? (
                                            <EditableRow
                                                row={row.original}
                                                tempEdit={tempEdit}
                                                onChange={(field, value) =>
                                                    setTempEdits((prev) => ({
                                                        ...prev,
                                                        [row.id]: { ...prev[row.id], [field]: value },
                                                    }))
                                                }
                                                onSave={() => handleSaveEdit(row.id)}
                                                onCancel={() => handleCancelEdit(row.id)}
                                            />
                                        ) : (
                                            row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-2">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))
                                        )}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Enhanced Pagination with Page Numbers */}
            <div className="flex items-center justify-between space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center space-x-2">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 w-8 p-0"
                            title="First page"
                        >
                            <span className="sr-only">Go to first page</span>⟪
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 w-8 p-0"
                            title="Previous page"
                        >
                            <span className="sr-only">Go to previous page</span>⟨
                        </Button>

                        {/* Page Number Buttons */}
                        {(() => {
                            const currentPage = table.getState().pagination.pageIndex;
                            const totalPages = table.getPageCount();
                            const maxVisiblePages = 5;

                            let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
                            let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

                            // Adjust start if we're near the end
                            if (endPage - startPage < maxVisiblePages - 1) {
                                startPage = Math.max(0, endPage - maxVisiblePages + 1);
                            }

                            const pages = [];

                            // Add first page if not visible
                            if (startPage > 0) {
                                pages.push(
                                    <Button
                                        key={0}
                                        variant={0 === currentPage ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => table.setPageIndex(0)}
                                        className="h-8 w-8 p-0"
                                    >
                                        1
                                    </Button>,
                                );

                                if (startPage > 1) {
                                    pages.push(
                                        <span key="ellipsis-start" className="px-1 text-muted-foreground">
                                            ...
                                        </span>,
                                    );
                                }
                            }

                            // Add visible page numbers
                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                    <Button
                                        key={i}
                                        variant={i === currentPage ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => table.setPageIndex(i)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {i + 1}
                                    </Button>,
                                );
                            }

                            // Add last page if not visible
                            if (endPage < totalPages - 1) {
                                if (endPage < totalPages - 2) {
                                    pages.push(
                                        <span key="ellipsis-end" className="px-1 text-muted-foreground">
                                            ...
                                        </span>,
                                    );
                                }

                                pages.push(
                                    <Button
                                        key={totalPages - 1}
                                        variant={totalPages - 1 === currentPage ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => table.setPageIndex(totalPages - 1)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {totalPages}
                                    </Button>,
                                );
                            }

                            return pages;
                        })()}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-8 w-8 p-0"
                            title="Next page"
                        >
                            <span className="sr-only">Go to next page</span>⟩
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="h-8 w-8 p-0"
                            title="Last page"
                        >
                            <span className="sr-only">Go to last page</span>⟫
                        </Button>
                    </div>
                </div>
            </div>{' '}
            {/* Bulk Action Confirmation Dialog */}
            <AlertDialog open={bulkActionDialog.isOpen} onOpenChange={(open) => !open && cancelBulkAction()}>
                <AlertDialogContent className="border-border bg-background text-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">{getActionTitle()}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">{getActionMessage()}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={cancelBulkAction}
                            className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBulkAction}
                            className={` ${
                                bulkActionDialog.action === 'delete'
                                    ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            } `}
                        >
                            {bulkActionDialog.action === 'delete' ? 'Delete' : 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default DataTableDemo;
// import axios from '../lib/axios';

// const ExceptionTester = () => {
//     const testEndpoint = async (endpoint: string, data?: any) => {
//         try {
//             const response = data ? await axios.post(endpoint, data) : await axios.get(endpoint);
//             console.log('✅ Success:', response.data);
//             alert(`Success: ${JSON.stringify(response.data)}`);
//         } catch (error: any) {
//             console.log('❌ Error:', error.response?.data);
//             alert(`Error ${error.response?.status}: ${JSON.stringify(error.response?.data, null, 2)}`);
//         }
//     };

//     return (
//         <div className="space-y-4 p-6">
//             <h2 className="text-2xl font-bold">Exception Handler Testing</h2>

//             <div className="grid grid-cols-2 gap-4">
//                 <button onClick={() => testEndpoint('/api/test/validation', {})} className="rounded bg-red-500 p-2 text-white">
//                     Test Validation Error (422)
//                 </button>

//                 <button onClick={() => testEndpoint('/api/test/auth')} className="rounded bg-yellow-500 p-2 text-white">
//                     Test Auth Error (401)
//                 </button>

//                 <button onClick={() => testEndpoint('/api/test/forbidden')} className="rounded bg-orange-500 p-2 text-white">
//                     Test Forbidden (403)
//                 </button>

//                 <button onClick={() => testEndpoint('/api/test/not-found')} className="rounded bg-purple-500 p-2 text-white">
//                     Test Not Found (404)
//                 </button>

//                 <button onClick={() => testEndpoint('/api/test/server-error')} className="rounded bg-gray-500 p-2 text-white">
//                     Test Server Error (500)
//                 </button>

//                 <button
//                     onClick={() => {
//                         // Test rate limiting by making multiple requests
//                         for (let i = 0; i < 5; i++) {
//                             setTimeout(() => testEndpoint('/api/test/throttle'), i * 100);
//                         }
//                     }}
//                     className="rounded bg-blue-500 p-2 text-white"
//                 >
//                     Test Rate Limiting (429)
//                 </button>

//                 <button
//                     onClick={() =>
//                         testEndpoint('/api/tasks', {
//                             title: '',
//                             priority: 'InvalidPriority',
//                         })
//                     }
//                     className="rounded bg-green-500 p-2 text-white"
//                 >
//                     Test Real Validation (Tasks)
//                 </button>

//                 <button onClick={() => testEndpoint('/api/user')} className="rounded bg-indigo-500 p-2 text-white">
//                     Test Real Auth (User)
//                 </button>
//             </div>

//             <div className="mt-6 rounded bg-gray-100 p-4">
//                 <p className="text-sm text-gray-600">
//                     Open browser console to see detailed error responses. Each button tests different exception types to verify your app.php exception
//                     handling.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default ExceptionTester;
