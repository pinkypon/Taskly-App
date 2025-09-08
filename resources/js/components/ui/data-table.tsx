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
import { format, parseISO } from 'date-fns';
import { ArrowUpDown, Calendar, Check, CheckCircle, ChevronDown, Edit, FileText, Flag, MoreHorizontal, Save, Trash2, X, XCircle } from 'lucide-react';
import * as React from 'react';

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

// Mobile Card Component
const MobileTaskCard = ({
    task,
    isSelected,
    isEditing,
    tempEdit,
    onSelect,
    onStartEdit,
    onSave,
    onCancel,
    onChange,
}: {
    task: Task;
    isSelected: boolean;
    isEditing: boolean;
    tempEdit: Partial<Task>;
    onSelect: (checked: boolean) => void;
    onStartEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (field: keyof Task, value: any) => void;
}) => {
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

    const isCompleted = task.completed;
    if (isEditing) {
        return (
            <div
                className={`space-y-4 rounded-lg border p-4 ${isSelected
                        ? 'border-indigo-300 bg-indigo-50/50 shadow-md shadow-indigo-100/50 dark:border-indigo-600 dark:bg-indigo-950/30 dark:shadow-indigo-900/20'
                        : 'border-border bg-background'
                    }`}
            >
                {/* Header with checkbox and actions */}
                <div className="flex items-center justify-between">
                    <Checkbox checked={isSelected} onCheckedChange={onSelect} className="border-border data-[state=checked]:bg-indigo-500" />
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={onSave} className="h-8 w-8 p-0">
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Editable fields */}
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-indigo-300">Title</label>
                        <Input value={tempEdit.title ?? task.title} onChange={(e) => onChange('title', e.target.value)} className="w-full" />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-indigo-300">Description</label>
                        <Input
                            value={tempEdit.description ?? task.description ?? ''}
                            onChange={(e) => onChange('description', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium dark:text-indigo-300">Completed</label>
                            <select
                                value={String(tempEdit.completed !== undefined ? (tempEdit.completed ? 1 : 0) : task.completed ? 1 : 0)}
                                onChange={(e) => onChange('completed', e.target.value === '1')}
                                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium dark:text-indigo-300">Priority</label>
                            <select
                                value={tempEdit.priority ?? task.priority}
                                onChange={(e) => onChange('priority', e.target.value)}
                                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-indigo-300">Due Date</label>
                        <Input
                            type="date"
                            value={tempEdit.due_date ?? task.due_date ?? ''}
                            onChange={(e) => onChange('due_date', e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`space-y-3 rounded-lg border p-4 transition-colors ${isSelected
                    ? 'border-indigo-300 bg-indigo-50/50 shadow-md shadow-indigo-100/50 dark:border-indigo-600 dark:bg-indigo-950/30 dark:shadow-indigo-900/20'
                    : 'border-border bg-background hover:border-indigo-200 hover:bg-muted/50 dark:hover:border-indigo-800'
                }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                    <Checkbox checked={isSelected} onCheckedChange={onSelect} className="mt-1 border-border data-[state=checked]:bg-indigo-500" />
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold dark:text-indigo-100">{task.title}</h3>
                        {task.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="ml-2 h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />⋮
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.id.toString())}>Copy Task ID</DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onStartEdit}>Edit Task</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Status and Priority Row */}
            <div className="flex items-center gap-4">
                <div className={`inline-flex items-center gap-1 text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-red-600'}`}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {isCompleted ? 'Completed' : 'Incomplete'}
                </div>

                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag className="h-3 w-3" />
                    {task.priority}
                </span>
            </div>

            {/* Due Date */}
            {task.due_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Due: {format(parseISO(task.due_date), 'MMM d, yyyy')}
                </div>
            )}
        </div>
    );
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
                <div className="flex justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onSave}
                        className="h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground"
                        aria-label="Save"
                        title="Save"
                    >
                        <Check className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onCancel}
                        className="h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground"
                        aria-label="Cancel"
                        title="Cancel"
                    >
                        <X className="h-3 w-3" />
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

export interface DataTableDemoHandle {
    refreshData: () => void;
}
interface DataTableDemoProps {
    onTaskStatusChange?: () => void;
    showToast?: (message: string, type: 'success' | 'error', iconType?: 'default' | 'check' | 'undo' | 'delete') => void;
}

export const DataTableDemo = React.forwardRef<DataTableDemoHandle, DataTableDemoProps>(({ onTaskStatusChange, showToast }, ref) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [data, setData] = React.useState<Task[]>([]);
    const [isMobile, setIsMobile] = React.useState(false);

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

    // Check if mobile view
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                        completed: task.completed,
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
            // console.log('Data refreshed from server:', response.data);
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Update the refreshData reference in useImperativeHandle
    React.useImperativeHandle(ref, () => ({
        refreshData: refreshDataWithPagination,
    }));
    const confirmBulkAction = async () => {
        const { action } = bulkActionDialog;
        const selectedIds = getSelectedRowIds();

        if (!action || selectedIds.length === 0) return;

        try {
            switch (action) {
                case 'complete':
                    await Promise.all(
                        selectedIds.map(async (id) => {
                            return await axios.put(`/api/tasks/${id}`, { completed: 1 });
                        }),
                    );
                    showToast?.('Task(s) marked as completed!', 'success', 'check'); // 👈 better message
                    onTaskStatusChange?.();
                    break;

                case 'incomplete':
                    await Promise.all(
                        selectedIds.map(async (id) => {
                            return await axios.put(`/api/tasks/${id}`, { completed: 0 });
                        }),
                    );
                    showToast?.('Task(s) marked as incomplete!', 'success', 'undo'); // 👈 better message
                    onTaskStatusChange?.();
                    break;

                case 'delete':
                    await Promise.all(
                        selectedIds.map(async (id) => {
                            return await axios.delete(`/api/tasks/${id}`);
                        }),
                    );
                    showToast?.('Task deleted successfully!', 'success', 'delete');
                    onTaskStatusChange?.();
                    break;
            }

            await refreshData();
            setRowSelection({});
        } catch (error: any) {
            console.error(`Failed to ${action} tasks:`, error);
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
                        className="border-border data-[state=checked]:bg-indigo-500 data-[state=checked]:text-primary-foreground"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="border-border data-[state=checked]:bg-indigo-500 data-[state=checked]:text-primary-foreground"
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
                            variant="activedark"
                            onClick={() => {
                                const current = column.getIsSorted();
                                if (current === false) column.toggleSorting(false);
                                else if (current === 'asc') column.toggleSorting(true);
                                else column.clearSorting();
                            }}
                            className="mx-auto text-white"
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
                                        <MoreHorizontal className="h-4 w-4" />⋮
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-border bg-popover text-popover-foreground">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    {/* <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(task.id.toString())}
                                        className="hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Copy Task ID
                                    </DropdownMenuItem> */}
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
        [handleStartEdit],
    );

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        getRowId: (row) => row.id,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination, // <– added
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination, // <– added
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        autoResetPageIndex: false, // <– crucial line
    });

    const handleSaveEdit = React.useCallback(
        async (rowId: string) => {
            const tempEdit = tempEdits[rowId];
            if (!tempEdit) return;

            // Store current pagination state before making the API call
            const currentPageIndex = table.getState().pagination.pageIndex;

            try {
                await axios.put(`/api/tasks/${rowId}`, tempEdit);

                // Update the data in place without refreshing from server
                setData((prev) => prev.map((row) => (row.id === rowId ? { ...row, ...tempEdit } : row)));

                // Call onTaskStatusChange if needed for analytics updates
                onTaskStatusChange?.();
                showToast?.('Task saved successfully!', 'success', 'check');
                // Clear editing state
                setEditingRows((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(rowId);
                    return newSet;
                });

                setTempEdits((prev) => {
                    const { [rowId]: _, ...rest } = prev;
                    return rest;
                });
            } catch (error) {
                console.error('Failed to update task:', error);
                showToast?.('Failed to update task.', 'error');
                // Optionally refresh data only on error
                // await refreshData();
                // table.setPageIndex(currentPageIndex);
            }
        },
        [tempEdits, onTaskStatusChange, table],
    );

    // Alternative: If you still want to refresh data from server, preserve pagination
    const refreshDataWithPagination = React.useCallback(async () => {
        const currentPageIndex = table.getState().pagination.pageIndex;
        const currentPageSize = table.getState().pagination.pageSize;

        try {
            const response = await axios.get('/api/tasks');
            setData(response.data);

            // Restore pagination state after data refresh
            setTimeout(() => {
                table.setPageSize(currentPageSize);
                table.setPageIndex(currentPageIndex);
            }, 0);

            // console.log('Data refreshed from server:', response.data);
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    }, [table]);

    const selectedRowCount = Object.keys(rowSelection).filter((id: string) => rowSelection[id]).length;
    const filteredData = table.getRowModel().rows.map((row) => row.original);

    return (
        <div className="w-full space-y-4 bg-background p-2 text-foreground md:p-4">
            {/* Filter and Column Visibility Controls */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <Input
                    placeholder="Filter title..."
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => {
                        table.getColumn('title')?.setFilterValue(event.target.value);
                        table.setPageIndex(0); // 👈 reset to page 1 on every search change
                    }}
                    className="w-full border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring sm:max-w-sm"
                />

                {!isMobile && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="task" className="border-input">
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
                )}
            </div>

            {/* Bulk Actions Bar */}
            {selectedRowCount > 0 && (
                <div className="flex flex-col items-start gap-3 rounded-md border border-border bg-muted/50 p-3 sm:flex-row sm:items-center">
                    <span className="text-sm text-muted-foreground">
                        {selectedRowCount} row{selectedRowCount > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('complete')}
                            className="h-8 border-green-200 bg-green-50 text-xs text-green-700 hover:bg-green-100 sm:text-sm dark:border-green-800 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-900/50"
                        >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            <span className="hidden sm:inline">Mark Complete</span>
                            <span className="sm:hidden">Complete</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('incomplete')}
                            className="h-8 border-yellow-200 bg-yellow-50 text-xs text-yellow-700 hover:bg-yellow-100 sm:text-sm dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                        >
                            <XCircle className="mr-1 h-4 w-4" />
                            <span className="hidden sm:inline">Mark Incomplete</span>
                            <span className="sm:hidden">Incomplete</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('delete')}
                            className="h-8 border-red-200 bg-red-50 text-xs text-red-700 hover:bg-red-100 sm:text-sm dark:border-red-800 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            )}

            {/* Mobile Cards View */}
            {isMobile ? (
                <div className="space-y-3">
                    {filteredData.length > 0 ? (
                        filteredData.map((task) => (
                            <MobileTaskCard
                                key={task.id}
                                task={task}
                                isSelected={rowSelection[task.id] || false}
                                isEditing={editingRows.has(task.id)}
                                tempEdit={tempEdits[task.id] || {}}
                                onSelect={(checked) => {
                                    setRowSelection((prev) => ({
                                        ...prev,
                                        [task.id]: checked,
                                    }));
                                }}
                                onStartEdit={() => handleStartEdit(task.id)}
                                onSave={() => handleSaveEdit(task.id)}
                                onCancel={() => handleCancelEdit(task.id)}
                                onChange={(field, value) => handleTempEdit(task.id, field, value)}
                            />
                        ))
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                            <p className="mb-2 text-lg font-medium">No tasks found</p>
                            <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Desktop Table View */
                <div className="rounded-md border border-border bg-background">
                    <Table>
                        <TableHeader className="bg-indigo-600">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="group border-b border-border hover:bg-indigo-700">
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
            )}

            {/* Enhanced Pagination */}
            <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="order-2 text-sm text-muted-foreground sm:order-1">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                {/* Page Size Selector - Mobile optimized */}
                <div className="order-1 flex items-center space-x-2 sm:order-2">
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

                {/* Page Navigation - Mobile optimized */}
                <div className="order-3 flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
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
                            title="First pages"
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

                        {/* Simplified page numbers for mobile */}
                        {!isMobile
                            ? (() => {
                                const currentPage = table.getState().pagination.pageIndex;
                                const totalPages = table.getPageCount();
                                const maxVisiblePages = 5;

                                let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
                                let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

                                if (endPage - startPage < maxVisiblePages - 1) {
                                    startPage = Math.max(0, endPage - maxVisiblePages + 1);
                                }

                                const pages = [];

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

                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <Button
                                            key={i}
                                            variant={i === currentPage ? 'active' : 'outline'}
                                            size="sm"
                                            onClick={() => table.setPageIndex(i)}
                                            className="h-8 w-8 p-0"
                                        >
                                            {i + 1}
                                        </Button>,
                                    );
                                }

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
                            })()
                            : null}

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
            </div>

            {/* Bulk Action Confirmation Dialog */}
            <AlertDialog open={bulkActionDialog.isOpen} onOpenChange={(open) => !open && cancelBulkAction()}>
                <AlertDialogContent className="mx-4 max-w-md border-border bg-background text-foreground sm:mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">{getActionTitle()}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">{getActionMessage()}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                        <AlertDialogCancel
                            onClick={cancelBulkAction}
                            className="w-full border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground sm:w-auto"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBulkAction}
                            className={`w-full sm:w-auto ${bulkActionDialog.action === 'delete'
                                    ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                        >
                            {bulkActionDialog.action === 'delete' ? 'Delete' : 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
});

DataTableDemo.displayName = 'DataTableDemo';

export default DataTableDemo;
