import { Column, Table } from "@tanstack/react-table";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";

export function exportToExcel<TData>(
  table: Table<TData>,
  filename: string = "export.xlsx",
  selectedFields?: string[]
) {
  // Get visible columns or selected fields
  const columnsToExport = selectedFields
    ? table.getAllColumns().filter((col) => selectedFields.includes(col.id))
    : table.getAllColumns().filter((col) => col.getIsVisible());

  // Prepare headers
  const headers = columnsToExport
    .filter((col) => col.id !== "actions")
    .map((col) => getColumnName(col));

  // Prepare data
  const data = table.getFilteredRowModel().rows.map((row) => {
    return columnsToExport
      .filter((col) => col.id !== "actions")
      .map((col) => formatCellValue(row.getValue(col.id)));
  });

  // Create worksheet
  const ws = utils.aoa_to_sheet([headers, ...data]);

  // Auto-size columns
  const colWidths = headers.map((header) => ({
    wch: Math.max(header.length, ...data.map((row) => String(row).length)),
  }));
  ws["!cols"] = colWidths;

  // Create workbook
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate file name with timestamp
  const timestampedFilename = `${filename.replace(".xlsx", "")}_${format(
    new Date(),
    "yyyy-MM-dd_HH-mm"
  )}.xlsx`;

  // Save file
  writeFile(wb, timestampedFilename);
}

function getColumnName<TData>(column: Column<TData>): string {
  const header = column.columnDef.header;
  if (typeof header === "string") return header;
  if (typeof header === "function") {
    // @ts-ignore
    const rendered = header({ column });
    if (typeof rendered === "string") return rendered;
  }
  return column.id;
}

function formatCellValue(value: any): string | number {
  if (value instanceof Date) {
    return format(value, "PP");
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value;
}
