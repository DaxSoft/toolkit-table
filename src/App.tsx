import {
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Trash2,
  Users,
} from "lucide-react";
import Table from "./toolkit-table";
import { z } from "zod";
import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import { SortButton } from "./components/table/columns";
import { FilterPopover } from "./components/table/filter-popover";
import { Badge } from "./components/ui/badge";
import { format } from "date-fns";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

type ColumnSchema = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  department: string;
  status: "active" | "inactive" | "pending";
  joinDate: Date;
  projects?: Array<string>;
};

const sample: ColumnSchema[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    department: "Engineering",
    status: "active",
    joinDate: new Date("2023-01-15"),
    projects: ["Project A", "Project B"],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    department: "Sales",
    status: "active",
    joinDate: new Date("2023-02-20"),
    projects: ["Project C"],
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "user",
    department: "Marketing",
    status: "inactive",
    joinDate: new Date("2023-03-10"),
    projects: [],
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "manager",
    department: "HR",
    status: "pending",
    joinDate: new Date("2023-04-05"),
    projects: ["Project D"],
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "user",
    department: "Engineering",
    status: "active",
    joinDate: new Date("2023-05-15"),
    projects: ["Project A"],
  },
];

export default function App() {
  return (
    <>
      <Table<ColumnSchema, ColumnSchema>
        breadcrumbLabel="Users"
        breadcrumbIcon={<Users className="h-5 w-5" />}
        buttonAddLabel="Add User"
        tableDescription={
          <>
            Manage your team members and their account permissions here. Add new
            users, edit existing ones, and control access levels.
          </>
        }
        data={sample}
        columns={[
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected()
                    ? true
                    : table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : undefined
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => (row.original as any).togglePinned?.()}
                  className={
                    row.getIsSelected()
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }
                >
                  {(row.original as any).isPinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "name",
            header: ({ column }) => {
              return (
                <div className="flex items-center space-x-2">
                  <SortButton column={column}>Name</SortButton>
                  <FilterPopover
                    column={column}
                    filterValue={column.getFilterValue() as any}
                    onFilterChange={(value) => column.setFilterValue(value)}
                  />
                </div>
              );
            },
            filterFn: "auto",
            meta: {
              type: "string",
            },
          },
          {
            accessorKey: "email",
            header: ({ column }) => {
              return (
                <div className="flex items-center space-x-2">
                  <SortButton column={column}>Email</SortButton>
                  <FilterPopover
                    column={column}
                    filterValue={column.getFilterValue() as any}
                    onFilterChange={(value) => column.setFilterValue(value)}
                  />
                </div>
              );
            },
            filterFn: "auto",
            meta: {
              type: "string",
            },
          },
          {
            accessorKey: "role",
            header: ({ column }) => {
              return (
                <div className="flex items-center space-x-2">
                  <SortButton column={column}>Role</SortButton>
                  <FilterPopover
                    column={column}
                    filterValue={column.getFilterValue() as any}
                    onFilterChange={(value) => column.setFilterValue(value)}
                  />
                </div>
              );
            },
            cell: ({ row }) => {
              const role = row.getValue("role") as string;
              return (
                <Badge
                  variant={
                    role === "admin"
                      ? "destructive"
                      : role === "manager"
                      ? "default"
                      : "secondary"
                  }
                >
                  {role}
                </Badge>
              );
            },
            filterFn: "auto",
            meta: {
              type: "string",
            },
          },
          {
            accessorKey: "department",
            header: ({ column }) => {
              return (
                <div className="flex items-center space-x-2">
                  <SortButton column={column}>Department</SortButton>
                  <FilterPopover
                    column={column}
                    filterValue={column.getFilterValue() as any}
                    onFilterChange={(value) => column.setFilterValue(value)}
                  />
                </div>
              );
            },
            filterFn: "auto",
            meta: {
              type: "string",
            },
          },
          {
            accessorKey: "status",
            header: ({ column }) => {
              return (
                <div className="flex items-center space-x-2">
                  <SortButton column={column}>Status</SortButton>
                  <FilterPopover
                    column={column}
                    filterValue={column.getFilterValue() as any}
                    onFilterChange={(value) => column.setFilterValue(value)}
                  />
                </div>
              );
            },
            cell: ({ row }) => {
              const status = row.getValue("status") as string;
              return (
                <Badge
                  variant={
                    status === "active"
                      ? "secondary"
                      : status === "inactive"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {status}
                </Badge>
              );
            },
            filterFn: "auto",
            meta: {
              type: "string",
            },
          },
          {
            accessorKey: "joinDate",
            header: ({ column }) => {
              return (
                <div className="flex items-center space-x-2">
                  <SortButton column={column}>Join Date</SortButton>
                  <FilterPopover
                    column={column}
                    filterValue={column.getFilterValue() as any}
                    onFilterChange={(value) => column.setFilterValue(value)}
                  />
                </div>
              );
            },
            cell: ({ row }) => format(row.getValue("joinDate"), "PP"),
            filterFn: "auto",
            sortingFn: (rowA, rowB, columnId) => {
              const a = rowA.getValue(columnId) as Date;
              const b = rowB.getValue(columnId) as Date;
              return a.getTime() - b.getTime();
            },
            meta: {
              type: "date",
            },
          },
          {
            id: "actions",
            cell: ({ row, table }) => {
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="fluent-glass">
                    <DropdownMenuItem
                      onClick={() =>
                        (table.options.meta as any)?.onEdit?.(row.original)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => console.log("Delete:", row.original)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          },
        ]}
      />
    </>
  );
}
