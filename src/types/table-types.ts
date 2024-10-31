import { ColumnDef, Row } from "@tanstack/react-table";

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
  bulkActionLabel?: React.ReactNode;
  bulkActionPinOn?: React.ReactNode;
  bulkActionPinOff?: React.ReactNode;
};

export type ToolkitTableLabels = {
  table: ToolkitTableLabelsTable;
};

export type ToolkitTableIconsTable = {
  breadcrumbIcon?: React.ReactNode;
  breadcrumbArrow?: React.ReactNode;
  addButton?: React.ReactNode;
  fontSizeSmall?: React.ReactNode;
  fontSizeMedium?: React.ReactNode;
  fontSizeBig?: React.ReactNode;
  themeWhite?: React.ReactNode;
  themeBlack?: React.ReactNode;
  comparassionLabelNone?: React.ReactNode;
  comparassionLabelUp?: React.ReactNode;
  comparassionLabelDown?: React.ReactNode;
  bulkAction?: React.ReactNode;
  pinOn?: React.ReactNode;
  pinOff?: React.ReactNode;
};

export type ToolkitTableIcons = {
  table: ToolkitTableIconsTable;
};

export type ToolkitTableBulkAction = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  action: string;
  callback: (selectedRows: Row<any>[]) => void;
  disabled?: boolean;
};

export type ToolkitTableProps<ColumnData> = {
  label: ToolkitTableLabels;
  icons: ToolkitTableIcons;
  columns: ColumnDef<ColumnData>[];
  data: ColumnData[];
  bulkAction?: ToolkitTableBulkAction[];
  loading?: boolean;
  defaultColumn?: Partial<ColumnDef<any, unknown>>;
  enableResizing: boolean;
  comparassionToggle?: ComparassionToggle;
  setComparassionToggle?: React.Dispatch<
    React.SetStateAction<ComparassionToggle>
  >;
};