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
import { useState } from "react";
import { CellComparison } from "./components/table/cell-comparasion";
import { ComparassionToggle } from "./components/table/data-table";

type ColumnSchema = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  joinDate: Date;
  age: number;
  projects?: Array<string>;
};

const sample: ColumnSchema[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    joinDate: new Date("2023-01-15"),
    age: 16,
    projects: ["Project A", "Project B"],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    joinDate: new Date("2023-02-20"),
    age: 18,
    projects: ["Project C"],
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    status: "inactive",
    joinDate: new Date("2023-03-10"),
    age: 33,
    projects: [],
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "pending",
    joinDate: new Date("2023-04-05"),
    age: 45,
    projects: ["Project D"],
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    status: "active",
    joinDate: new Date("2023-05-15"),
    age: 17,
    projects: ["Project A"],
  },
];

export default function App() {
  const [comparassionToggle, setComparassionToggle] =
    useState<ComparassionToggle>("none");

  return (
    <>
      <Table<ColumnSchema>
        enableResizing={false}
        comparassionToggle={comparassionToggle}
        setComparassionToggle={setComparassionToggle}
        breadcrumbLabel="Users"
        breadcrumbIcon={<Users className="h-5 w-5" />}
        buttonAddLabel="Add User"
        exportButton="Export"
        viewButton="View"
        visualizeButton="Visualization"
        bulkActionsLabel="Bulk Actions"
        tableDescription={
          <>
            Manage your team members and their account permissions here. Add new
            users, edit existing ones, and control access levels.
          </>
        }
        defaultColumn={{
          size: 200, //starting column size
          minSize: 50, //enforced during column resizing
          maxSize: 300, //enforced during column resizing
        }}
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
            enableResizing: false,
            size: 50,
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
            filterFn: "custom",
            meta: {
              type: "string",
            },
            enableResizing: true,
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
            filterFn: "custom",
            meta: {
              type: "string",
            },
            enableResizing: true,
          },
          {
            accessorKey: "age",
            header: ({ column }) => {
              return (
                <div className="flex items-center space-x-2">
                  <SortButton column={column}>Age</SortButton>
                  <FilterPopover
                    column={column}
                    filterValue={column.getFilterValue() as any}
                    onFilterChange={(value) => column.setFilterValue(value)}
                  />
                </div>
              );
            },
            cell: ({ row, table }) => {
              const value = row.getValue("age") as number;

              // Get the next row's value for comparison
              const rowIndex = row.index;
              const nextRow =
                table.getRowModel().rows[
                  comparassionToggle === "down" ? rowIndex + 1 : rowIndex - 1
                ];
              const nextValue = nextRow?.getValue("age") as number | undefined;

              return (
                <div className="flex items-center">
                  <span>{value}</span>
                  {comparassionToggle !== "none" && (
                    <CellComparison
                      value={value}
                      nextValue={nextValue}
                      type="number"
                    />
                  )}
                </div>
              );
            },
            filterFn: "custom",
            meta: {
              type: "number",
            },
            enableResizing: true,
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
            filterFn: "custom",
            meta: {
              type: "string",
            },
            enableResizing: true,
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
            cell: ({ row, table }) => {
              const value = row.getValue("joinDate") as Date;
              const formattedDate = format(value, "PP");

              // Get the next row's value for comparison
              const rowIndex = row.index;
              const nextRow =
                table.getRowModel().rows[
                  comparassionToggle === "down" ? rowIndex + 1 : rowIndex - 1
                ];
              const nextValue = nextRow?.getValue("joinDate") as
                | Date
                | undefined;

              return (
                <div className="flex items-center">
                  <span>{formattedDate}</span>
                  {comparassionToggle !== "none" && (
                    <CellComparison
                      value={value}
                      nextValue={nextValue}
                      type="date"
                    />
                  )}
                </div>
              );
            },
            filterFn: "custom",
            sortingFn: (rowA, rowB, columnId) => {
              const a = rowA.getValue(columnId) as Date;
              const b = rowB.getValue(columnId) as Date;
              return a.getTime() - b.getTime();
            },
            meta: {
              type: "date",
            },
            enableResizing: true,
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
            size: 50,
            enableResizing: false,
          },
        ]}
      />
    </>
  );
}
