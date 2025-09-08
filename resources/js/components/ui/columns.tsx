import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/types/task"; // ✅ consistent import


export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
header: ({ table }) => (
  <Checkbox
    checked={table.getIsAllPageRowsSelected()}
    indeterminate={table.getIsSomePageRowsSelected()}
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    aria-label="Select all"
  />
),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    id: "title", // ✅ Add this to avoid type mismatch
    header: "Title",
  },
  {
    accessorKey: "due_date",
    id: "due_date",
    header: "Due Date",
  },
  {
    accessorKey: "completed",
    id: "completed",
    header: "Completed",
    cell: ({ row }) => (row.getValue("completed") ? "✅" : "❌"),
  },
];
