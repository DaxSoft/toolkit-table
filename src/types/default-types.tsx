import {
  ToolkitTableFeatures,
  ToolkitTableFeatureTable,
  ToolkitTableIconsTable,
  ToolkitTableLabels,
  ToolkitTableLabelsCommand,
  ToolkitTableLabelsTable,
  ToolkitTableLabelsVisualization,
  ToolkitTableSettingsFontSize,
} from "./table-types";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  BarChart2Icon,
  ChevronRightIcon,
  CommandIcon,
  DownloadIcon,
  ListRestartIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  SunIcon,
  TableIcon,
  TextIcon,
} from "lucide-react";

export const DefaultToolkitTableLabelsTable: ToolkitTableLabelsTable = {
  buttonAdd: "Add",
  breadcrumbLabel: "Table",
  exportLabel: "Export",
  viewLabel: "View",
  comparassionLabelNone: "Comparassion",
  comparassionLabelUp: "Next row",
  comparassionLabelDown: "Previous row",
  description: "Description of the table",
  rowsSelectedLabel: "row(s) selected",
  rowsPerPageLabel: "Rows per page",
  perPageLabel: "Page",
  bulkActionLabel: "Bulk action",
  bulkActionPinOn: "Pin Selected",
  bulkActionPinOff: "Unpin Selected",
  name: "Table",
  refreshLabel: "Refresh",
  visualizationLabel: "Visualization",
  commandLabel: "Commands",
};

export const DefaultToolkitTableLabelsCommand: ToolkitTableLabelsCommand = {
  placeholder: "Type a command or search...",
  empty: "No results found.",
};

export const DefaultToolkitTableLabelsVisualization: ToolkitTableLabelsVisualization =
  {
    goBack: "Go Back",
    title: "Visualization",
  };

export const DefaultToolkitTableLabels: ToolkitTableLabels = {
  table: DefaultToolkitTableLabelsTable,
  command: DefaultToolkitTableLabelsCommand,
  visualization: DefaultToolkitTableLabelsVisualization,
};

export const DefaultToolkitTableIcons: ToolkitTableIconsTable = {
  breadcrumbIcon: <TableIcon className="h-5 w-5" />,
  breadcrumbArrow: <ChevronRightIcon className="h-4 w-4" />,
  addButton: <PlusIcon className="mr-2 h-4 w-4" />,
  fontSizeSmall: <TextIcon className="h-4 w-4" />,
  fontSizeMedium: <TextIcon className="h-5 w-5" />,
  fontSizeBig: <TextIcon className="h-6 w-6" />,
  themeWhite: <SunIcon className="h-4 w-4" />,
  themeBlack: <MoonIcon className="h-4 w-4" />,
  comparassionLabelNone: <ArrowUpDownIcon className="h-4 w-4" />,
  comparassionLabelDown: <ArrowDownIcon className="h-4 w-4" />,
  comparassionLabelUp: <ArrowUpIcon className="h-4 w-4" />,
  bulkAction: <MoreHorizontalIcon className="mr-2 h-4 w-4" />,
  pinOn: <PinIcon className="mr-2 h-4 w-4" />,
  pinOff: <PinOffIcon className="mr-2 h-4 w-4" />,
  view: <SlidersHorizontalIcon className="mr-2 h-4 w-4" />,
  visualization: <BarChart2Icon className="mr-2 h-4 w-4" />,
  export: <DownloadIcon className="mr-2 h-4 w-4" />,
  refresh: <ListRestartIcon className="mr-2 h-4 w-4" />,
  rowAction: <MoreHorizontalIcon className="h-4 w-4" />,
  command: <CommandIcon className="h-4 w-4" />,
};

export const DefaultToolkitTableFeatures: Record<
  ToolkitTableFeatureTable,
  boolean
> = {
  [ToolkitTableFeatureTable.Add]: true,
  [ToolkitTableFeatureTable.Breadcrumb]: true,
  [ToolkitTableFeatureTable.Comparassion]: true,
  [ToolkitTableFeatureTable.Description]: true,
  [ToolkitTableFeatureTable.Export]: true,
  [ToolkitTableFeatureTable.FontSize]: true,
  [ToolkitTableFeatureTable.Pagination]: true,
  [ToolkitTableFeatureTable.Refresh]: true,
  [ToolkitTableFeatureTable.Theme]: false,
  [ToolkitTableFeatureTable.View]: true,
  [ToolkitTableFeatureTable.Visualization]: true,
  [ToolkitTableFeatureTable.Command]: true,
};

export const DefaultFontSizeClasses: ToolkitTableSettingsFontSize = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};
