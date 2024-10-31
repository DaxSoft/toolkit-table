import { ColumnDef } from "@tanstack/react-table";

export type SortedType = "false" | "asc" | "desc";
export type FontSize = "sm" | "md" | "lg";
export type ComparassionToggle = "down" | "up" | "none";

export type ToolkitTableLabelsTable = {
  buttonAdd?: React.ReactNode;
  breadcrumbLabel?: React.ReactNode;
  exportLabel?: React.ReactNode;
  viewLabel?: React.ReactNode;
  comparassionLabelNone?: React.ReactNode;
  comparassionLabelUp?: React.ReactNode;
  comparassionLabelDown?: React.ReactNode;
  description?: React.ReactNode;
  rowsSelectedLabel?: React.ReactNode;
  rowsPerPageLabel?: React.ReactNode;
  perPageLabel?: React.ReactNode;
  name?: string;
};

export type ToolkitTableLabels = {
  table: ToolkitTableLabelsTable;
};

export type ToolkitTableIconsTable = {
  breadcrumbIcon?: React.ReactNode;
  breadcrumbArrow?: React.ReactNode;
  addButton?: React.ReactNode;
};

export type ToolkitTableIcons = {
  table: ToolkitTableIconsTable;
};

export type ToolkitTableProps<ColumnData> = {
  label: ToolkitTableLabels;
  icons: ToolkitTableIcons;
  breadcrumbIcon: React.ReactNode;
  breadcrumbLabel: React.ReactNode;
  tableDescription: React.ReactNode;
  buttonAddLabel: React.ReactNode;
  columns: ColumnDef<ColumnData>[];
  data: ColumnData[];
  loading?: boolean;
  exportButton: React.ReactNode;
  visualizeButton: React.ReactNode;
  viewButton: React.ReactNode;
  defaultColumn?: Partial<ColumnDef<any, unknown>>;
  bulkActionsLabel: React.ReactNode;
  enableResizing: boolean;
  comparassionToggle?: ComparassionToggle;
  setComparassionToggle?: React.Dispatch<
    React.SetStateAction<ComparassionToggle>
  >;
};
