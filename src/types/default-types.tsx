import {
  ToolkitTableBulkAction,
  ToolkitTableIconsTable,
  ToolkitTableLabelsTable,
} from "./table-types";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
  SunIcon,
  TableIcon,
  TextIcon,
} from "lucide-react";

export const DefaultToolkitTableLabelsTable: ToolkitTableLabelsTable = {
  buttonAdd: "Add {{title}}",
  breadcrumbLabel: "{{title}}",
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
};