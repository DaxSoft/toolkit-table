import { useState, useCallback, useMemo, useEffect } from "react";
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
  Sun,
  Moon,
  ArrowUpDown,
} from "lucide-react";
import { applyFilter } from "@/lib/filters";
import { ExportXlsxDialog } from "@/components/export/export-xlsx.dialog";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { Switch } from "../ui/switch";

const MotionTableRow = motion(TableRow);

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

type FontSize = "sm" | "md" | "lg";

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onEdit?: (row: TData) => void;
  exportButton: React.ReactNode;
  visualizeButton: React.ReactNode;
  viewButton: React.ReactNode;
  toggleComparassion?: boolean;
  setToggleComparassion?: React.Dispatch<React.SetStateAction<boolean>>;
  defaultColumn?: Partial<ColumnDef<any, unknown>>;
  bulkActionsLabel: React.ReactNode;
  enableResizing: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  onEdit,
  exportButton,
  visualizeButton,
  viewButton,
  toggleComparassion,
  setToggleComparassion,
  defaultColumn,
  bulkActionsLabel,
  enableResizing,
}: DataTableProps<TData, TValue>) {
  const itHasToggleComparassion = !!setToggleComparassion;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showVisualizationDialog, setShowVisualizationDialog] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [pinnedRows, setPinnedRows] = useState<Record<string, boolean>>({});
  const { theme, setTheme } = useTheme();

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  // Memoize the enhanced data to prevent unnecessary recalculations
  const enhancedData = useMemo(() => {
    return data.map((row: any) => ({
      ...row,
      isPinned: pinnedRows[row.id],
    }));
  }, [data, pinnedRows]);

  // Memoize the row toggling function
  const togglePinned = useCallback((id: string) => {
    setPinnedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const table = useReactTable({
    data: enhancedData,
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
        const column = columns.find((col) => {
          const _col = col as any;
          return _col?.accessorKey === columnId || col.id === columnId;
        });
        const meta = column?.meta as any;
        const type = (meta?.type as "string" | "number" | "date") || "string";
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
    enableColumnResizing: enableResizing,
    columnResizeMode: "onChange",
    defaultColumn,
  });

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

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
            const id = (row.original as any).id;
            setPinnedRows((prev) => ({ ...prev, [id]: true }));
          });
          break;
        case "unpin":
          selectedRows.forEach((row) => {
            const id = (row.original as any).id;
            setPinnedRows((prev) => ({ ...prev, [id]: false }));
          });
          break;
      }
    },
    [table]
  );

  // Memoize the sorted rows
  const sortedRows = useMemo(() => {
    return table.getRowModel().rows.sort((a, b) => {
      const aPinned = (a.original as any).isPinned;
      const bPinned = (b.original as any).isPinned;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [table.getRowModel().rows]);

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
          <div className="h-4 w-px bg-border/50" />
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="fluent-button-secondary h-8 w-8 p-0"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
          {itHasToggleComparassion && (
            <div className="flex items-center space-x-2 ml-4">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={toggleComparassion}
                onCheckedChange={setToggleComparassion}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {table.getSelectedRowModel().rows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="fluent-button dark:text-foreground"
                >
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  {bulkActionsLabel} ({table.getSelectedRowModel().rows.length})
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
            className="fluent-button dark:text-foreground"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            {visualizeButton}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="fluent-button dark:text-foreground"
          >
            <Download className="mr-2 h-4 w-4" />
            {exportButton}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="fluent-button dark:text-foreground"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {viewButton}
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
        <Table
          style={{
            ...columnSizeVars, //Define column sizes on the <table> element
            width: enableResizing ? table.getTotalSize() : undefined,
          }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={fontSizeClasses[fontSize]}
                      style={{
                        width: `${header.getSize()}px`,
                        position: "relative",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
                            header.column.getIsResizing()
                              ? "bg-primary/50"
                              : "bg-border/50 hover:bg-primary/50"
                          )}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {sortedRows.length ? (
                sortedRows.map((row, i) => (
                  <MotionTableRow
                    key={row.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "group transition-colors duration-200",
                      (row.original as any).isPinned &&
                        "sticky top-0 bg-muted/50 backdrop-blur-sm shadow-md",
                      i % 2 === 1 && theme === "dark"
                        ? "bg-gray-800/30"
                        : i % 2 === 1
                        ? "bg-gray-50/50"
                        : ""
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "select") {
                        return (
                          <TableCell
                            key={cell.id}
                            style={{ width: `${cell.column.getSize()}px` }}
                          >
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={row.getIsSelected()}
                                onChange={(e) =>
                                  row.toggleSelected(e.target.checked)
                                }
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  togglePinned((row.original as any).id)
                                }
                                className={cn(
                                  "transition-opacity duration-200",
                                  row.getIsSelected()
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                                )}
                              >
                                {(row.original as any).isPinned ? (
                                  <PinOff className="h-4 w-4" />
                                ) : (
                                  <Pin className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(fontSizeClasses[fontSize], "text-left")}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </MotionTableRow>
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
