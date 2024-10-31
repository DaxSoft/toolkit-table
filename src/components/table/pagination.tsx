import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ToolkitTableLabelsTable } from "@/types/table-types";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  rowsPerPage?: number[];
  tableLabels: ToolkitTableLabelsTable;
}

export function DataTablePagination<TData>({
  table,
  rowsPerPage = [10, 20, 50, 100],
  tableLabels,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} -{" "}
        {table.getFilteredRowModel().rows.length}&nbsp;
        {tableLabels.rowsSelectedLabel}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-foreground">
            {tableLabels.rowsPerPageLabel}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger
              className={cn(
                "h-8 w-[70px] fluent-input",
                "dark:bg-muted/30 dark:text-foreground dark:border-border/50",
                "dark:hover:bg-muted/50 dark:focus:bg-muted/50"
              )}
            >
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent
              side="top"
              className={cn(
                "fluent-glass",
                "dark:bg-background/95 dark:border-border/50",
                "dark:backdrop-blur-xl"
              )}
            >
              {rowsPerPage?.map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className={cn(
                    "dark:text-foreground",
                    "dark:focus:bg-muted/50 dark:hover:bg-muted/50",
                    "dark:focus:text-foreground dark:hover:text-foreground"
                  )}
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-foreground">
          {tableLabels.perPageLabel}&nbsp;
          {table.getState().pagination.pageIndex + 1} - {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className={cn(
              "hidden h-8 w-8 p-0 lg:flex fluent-button-secondary",
              "dark:text-foreground dark:hover:text-foreground",
              "dark:hover:bg-muted/50 dark:focus:bg-muted/50"
            )}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className={cn(
              "h-8 w-8 p-0 fluent-button-secondary",
              "dark:text-foreground dark:hover:text-foreground",
              "dark:hover:bg-muted/50 dark:focus:bg-muted/50"
            )}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className={cn(
              "h-8 w-8 p-0 fluent-button-secondary",
              "dark:text-foreground dark:hover:text-foreground",
              "dark:hover:bg-muted/50 dark:focus:bg-muted/50"
            )}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className={cn(
              "hidden h-8 w-8 p-0 lg:flex fluent-button-secondary",
              "dark:text-foreground dark:hover:text-foreground",
              "dark:hover:bg-muted/50 dark:focus:bg-muted/50"
            )}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
