import { DataPoint } from "@/components/table/chart-number";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { EChartsOption } from "echarts";
import { z, ZodNumber, ZodString } from "zod";

export type SortedType = "false" | "asc" | "desc";
export type FontSize = "sm" | "md" | "lg";
export enum ComparassionToggle {
  none = "none",
  down = "down",
  up = "up",
}

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
  refreshLabel?: React.ReactNode;
  visualizationLabel?: React.ReactNode;
  commandLabel?: React.ReactNode;
  editLabel?: React.ReactNode;
  deleteLabel?: React.ReactNode;
};

export type ToolkitTableLabelsCommand = {
  placeholder?: string;
  empty?: React.ReactNode;
};

export type ToolkitTableLabelsVisualization = {
  title?: React.ReactNode;
  goBack?: React.ReactNode;
  highestLabel?: React.ReactNode;
  lowestLabel?: React.ReactNode;
  averageLabel?: React.ReactNode;
  totalLabel?: React.ReactNode;
};

export type ToolkitTableLabelsForm = {
  add?: React.ReactNode;
  remove?: React.ReactNode;
  deleteDescription?: React.ReactNode;
  delete?: React.ReactNode;
  deleteCancel?: React.ReactNode;
  deleteContinue?: React.ReactNode;
  export?: React.ReactNode;
  exportCancel?: React.ReactNode;
  exportContinue?: React.ReactNode;
  exportSelectFields?: React.ReactNode;
  exportSelectFieldsPreview?: React.ReactNode;
  exportingLabel?: React.ReactNode;
};

export type ToolkitTableLabels = {
  table: ToolkitTableLabelsTable;
  command: ToolkitTableLabelsCommand;
  visualization: ToolkitTableLabelsVisualization;
  form: ToolkitTableLabelsForm;
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
  view?: React.ReactNode;
  export?: React.ReactNode;
  visualization?: React.ReactNode;
  refresh?: React.ReactNode;
  rowAction?: React.ReactNode;
  command?: React.ReactNode;
  edit?: React.ReactNode;
  delete?: React.ReactNode;
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

export type ToolkitTableSettingsTable<ColumnData> = {
  enableResizing?: boolean;
  comparassionToggle?: ComparassionToggle;
  setComparassionToggle?: React.Dispatch<
    React.SetStateAction<ComparassionToggle>
  >;
  defaultColumnsParamater?: Partial<ColumnDef<any, unknown>>;
  buttonAddCallback?: () => void;
  onRefresh?: () => Promise<void>;
  rowsPerPage?: number[];
  onDelete?: (context: CellContext<ColumnData, unknown>) => Promise<void>;
};

export type ToolkitTableSettingsFontSize = {
  sm?: string;
  md?: string;
  lg?: string;
};

export type ToolkitTableSettings<ColumnData> = {
  table?: ToolkitTableSettingsTable<ColumnData>;
  fontSize?: ToolkitTableSettingsFontSize;
};

export enum ToolkitTableFeatureTable {
  Comparassion = "Comparassion",
  FontSize = "FontSize",
  Theme = "Theme",
  Visualization = "Visualization",
  Export = "Export",
  View = "View",
  Add = "Add",
  Pagination = "Pagination",
  Description = "Description",
  Breadcrumb = "Breadcrumb",
  Refresh = "Refresh",
  Command = "Command",
  Delete = "Delete",
  Edit = "Edit",
  Read = "Read",
}

export type ToolkitTableFeatures = {
  table?: Record<ToolkitTableFeatureTable, boolean>;
};

export type ToolkitTableRowAction<ColumnSchema> = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  action: string;
  callback: (context: CellContext<ColumnSchema, unknown>) => void;
  disabled?: boolean;
};

export type ToolkitTableCommand = {
  callback: () => void;
  label: React.ReactNode;
  icon?: React.ReactNode;
};

export type ToolkitTableVisualization =
  | {
      title: string;
      data: DataPoint[];
      type: "number";
    }
  | {
      title: string;
      data: Record<string, any>[];
      type: "custom";
      chart: (title: string, data: Record<string, any>[]) => EChartsOption;
    };

export type ToolkitTableSettingsProps = {
  headers?: Record<string, string>;
};

export enum ToolkitTableFormType {
  Text = "Text",
  Number = "Number",
  Currency = "Currency",
  Decimal = "Decimal",
  Phone = "Phone",
  Cpf = "Cpf",
  Cnpj = "Cnpj",
}

export type ToolkitTableFormProps =
  | {
      type:
        | ToolkitTableFormType.Text
        | ToolkitTableFormType.Cnpj
        | ToolkitTableFormType.Cpf
        | ToolkitTableFormType.Phone;
      value: ZodString;
      label: React.ReactNode;
      description?: React.ReactNode;
      placeholder?: React.ReactNode;
      mask?: string;
    }
  | {
      type:
        | ToolkitTableFormType.Number
        | ToolkitTableFormType.Currency
        | ToolkitTableFormType.Decimal;
      value: ZodNumber;
      label: React.ReactNode;
      description?: React.ReactNode;
      placeholder?: React.ReactNode;
      mask?: string;
      decimalScale?: number;
      prefix?: string;
      suffix?: string;
    };

export type ToolkitTableProps<ColumnData> = {
  label?: ToolkitTableLabels;
  icons?: ToolkitTableIcons;
  columns: ColumnDef<ColumnData>[];
  data: ColumnData[];
  bulkAction?: ToolkitTableBulkAction[];
  loading?: boolean;
  settings?: ToolkitTableSettings<ColumnData>;
  rowActions?: Array<ToolkitTableRowAction<ColumnData>>;
  features?: ToolkitTableFeatures;
  commands?: Record<string, ToolkitTableCommand[]>;
  visualizations?: Record<string, ToolkitTableVisualization>;
  form?: Record<string, ToolkitTableFormProps[]>;
  exportSettings?: ToolkitTableSettingsProps;
};
