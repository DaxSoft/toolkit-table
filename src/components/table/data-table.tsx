import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "./pagination";
import {
  Download,
  BarChart2,
  SlidersHorizontal,
  TextIcon,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash2,
  Mail,
} from "lucide-react";
import { applyFilter } from "@/lib/filters";
import { ExportXlsxDialog } from "@/components/export/export-xlsx.dialog";
import { cn } from "@/lib/utils";

type FontSize = "sm" | "md" | "lg";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onEdit?: (row: TData) => void;
}

const tableVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export function DataTable<TData, TValue>({
  columns,
  data,
  onEdit,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showVisualizationDialog, setShowVisualizationDialog] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [pinnedRows, setPinnedRows] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data: data.map((row: any) => ({
      ...row,
      isPinned: pinnedRows[row.id],
      togglePinned: () => {
        setPinnedRows((prev) => ({
          ...prev,
          [row.id]: !prev[row.id],
        }));
      },
    })),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    filterFns: {
      custom: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId);
        const column = columns.find(
          (col) => col.accessorKey === columnId || col.id === columnId
        );
        const type =
          (column?.meta?.type as "string" | "number" | "date") || "string";
        return applyFilter(value, filterValue, type);
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onEdit,
    },
  });

  const fontSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const handleBulkAction = useCallback(
    (action: string) => {
      const selectedRows = table.getSelectedRowModel().rows;
      switch (action) {
        case "delete":
          console.log("Delete selected rows:", selectedRows);
          break;
        case "email":
          console.log("Email selected users:", selectedRows);
          break;
        case "pin":
          selectedRows.forEach((row) => {
            setPinnedRows((prev) => ({
              ...prev,
              [(row.original as any).id]: true,
            }));
          });
          break;
        case "unpin":
          selectedRows.forEach((row) => {
            setPinnedRows((prev) => ({
              ...prev,
              [(row.original as any).id]: false,
            }));
          });
          break;
      }
    },
    [table]
  );

  const sortedRows = table.getRowModel().rows.sort((a, b) => {
    const aPinned = pinnedRows[(a.original as any).id];
    const bPinned = pinnedRows[(b.original as any).id];
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFontSize("sm")}
            className={cn(
              "fluent-button-secondary h-8 w-8 p-0",
              fontSize === "sm" && "bg-muted"
            )}
          >
            <TextIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFontSize("md")}
            className={cn(
              "fluent-button-secondary h-8 w-8 p-0",
              fontSize === "md" && "bg-muted"
            )}
          >
            <TextIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFontSize("lg")}
            className={cn(
              "fluent-button-secondary h-8 w-8 p-0",
              fontSize === "lg" && "bg-muted"
            )}
          >
            <TextIcon className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {table.getSelectedRowModel().rows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="fluent-button">
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  Bulk Actions ({table.getSelectedRowModel().rows.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="fluent-glass">
                <DropdownMenuItem onClick={() => handleBulkAction("pin")}>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("unpin")}>
                  <PinOff className="mr-2 h-4 w-4" />
                  Unpin Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("email")}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVisualizationDialog(true)}
            className="fluent-button"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Visualize
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="fluent-button"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="fluent-button">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="fluent-glass">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <motion.div
        className="fluent-table"
        variants={tableVariants}
        initial="hidden"
        animate="show"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={fontSizeClasses[fontSize]}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {sortedRows.length ? (
                sortedRows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    variants={rowVariants}
                    custom={i}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "group",
                      pinnedRows[(row.original as any).id] &&
                        "sticky top-0 bg-muted/50 backdrop-blur-sm"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={fontSizeClasses[fontSize]}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className={cn(
                      "h-24 text-center",
                      fontSizeClasses[fontSize]
                    )}
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
      <DataTablePagination table={table} />
      <ExportXlsxDialog
        table={table}
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
      />
    </motion.div>
  );
}
