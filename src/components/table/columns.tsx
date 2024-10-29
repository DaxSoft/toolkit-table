import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Pin,
  PinOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { FilterPopover } from "./filter-popover";

type IsSortedType = "false" | "asc" | "desc";

export const SortButton = ({
  column,
  children,
}: {
  column: any;
  children: React.ReactNode;
}) => {
  const isSorted = column.getIsSorted() as IsSortedType;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-transparent"
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      {children}
      {
        {
          asc: <ArrowUp className="ml-2 h-4 w-4" />,
          desc: <ArrowDown className="ml-2 h-4 w-4" />,
          false: <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />,
        }[isSorted || "false"]
      }
    </Button>
  );
};

// export const columns: ColumnDef<User>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <div className="flex items-center space-x-2">
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => (row.original as any).togglePinned?.()}
//           className={
//             row.getIsSelected()
//               ? "opacity-100"
//               : "opacity-0 group-hover:opacity-100"
//           }
//         >
//           {(row.original as any).isPinned ? (
//             <PinOff className="h-4 w-4" />
//           ) : (
//             <Pin className="h-4 w-4" />
//           )}
//         </Button>
//       </div>
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <div className="flex items-center space-x-2">
//           <SortButton column={column}>Name</SortButton>
//           <FilterPopover
//             column={column}
//             filterValue={column.getFilterValue() as any}
//             onFilterChange={(value) => column.setFilterValue(value)}
//           />
//         </div>
//       );
//     },
//     filterFn: "custom",
//     meta: {
//       type: "string",
//     },
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => {
//       return (
//         <div className="flex items-center space-x-2">
//           <SortButton column={column}>Email</SortButton>
//           <FilterPopover
//             column={column}
//             filterValue={column.getFilterValue() as any}
//             onFilterChange={(value) => column.setFilterValue(value)}
//           />
//         </div>
//       );
//     },
//     filterFn: "custom",
//     meta: {
//       type: "string",
//     },
//   },
//   {
//     accessorKey: "role",
//     header: ({ column }) => {
//       return (
//         <div className="flex items-center space-x-2">
//           <SortButton column={column}>Role</SortButton>
//           <FilterPopover
//             column={column}
//             filterValue={column.getFilterValue() as any}
//             onFilterChange={(value) => column.setFilterValue(value)}
//           />
//         </div>
//       );
//     },
//     cell: ({ row }) => {
//       const role = row.getValue("role") as string;
//       return (
//         <Badge
//           variant={
//             role === "admin"
//               ? "destructive"
//               : role === "manager"
//               ? "default"
//               : "secondary"
//           }
//         >
//           {role}
//         </Badge>
//       );
//     },
//     filterFn: "custom",
//     meta: {
//       type: "string",
//     },
//   },
//   {
//     accessorKey: "department",
//     header: ({ column }) => {
//       return (
//         <div className="flex items-center space-x-2">
//           <SortButton column={column}>Department</SortButton>
//           <FilterPopover
//             column={column}
//             filterValue={column.getFilterValue() as any}
//             onFilterChange={(value) => column.setFilterValue(value)}
//           />
//         </div>
//       );
//     },
//     filterFn: "custom",
//     meta: {
//       type: "string",
//     },
//   },
//   {
//     accessorKey: "status",
//     header: ({ column }) => {
//       return (
//         <div className="flex items-center space-x-2">
//           <SortButton column={column}>Status</SortButton>
//           <FilterPopover
//             column={column}
//             filterValue={column.getFilterValue() as any}
//             onFilterChange={(value) => column.setFilterValue(value)}
//           />
//         </div>
//       );
//     },
//     cell: ({ row }) => {
//       const status = row.getValue("status") as string;
//       return (
//         <Badge
//           variant={
//             status === "active"
//               ? "success"
//               : status === "inactive"
//               ? "destructive"
//               : "warning"
//           }
//         >
//           {status}
//         </Badge>
//       );
//     },
//     filterFn: "custom",
//     meta: {
//       type: "string",
//     },
//   },
//   {
//     accessorKey: "joinDate",
//     header: ({ column }) => {
//       return (
//         <div className="flex items-center space-x-2">
//           <SortButton column={column}>Join Date</SortButton>
//           <FilterPopover
//             column={column}
//             filterValue={column.getFilterValue() as any}
//             onFilterChange={(value) => column.setFilterValue(value)}
//           />
//         </div>
//       );
//     },
//     cell: ({ row }) => format(row.getValue("joinDate"), "PP"),
//     filterFn: "custom",
//     sortingFn: (rowA, rowB, columnId) => {
//       const a = rowA.getValue(columnId) as Date;
//       const b = rowB.getValue(columnId) as Date;
//       return a.getTime() - b.getTime();
//     },
//     meta: {
//       type: "date",
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row, table }) => {
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="fluent-glass">
//             <DropdownMenuItem
//               onClick={() =>
//                 (table.options.meta as any)?.onEdit?.(row.original)
//               }
//             >
//               <Pencil className="mr-2 h-4 w-4" />
//               Edit
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => console.log("Delete:", row.original)}
//             >
//               <Trash2 className="mr-2 h-4 w-4" />
//               Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];
