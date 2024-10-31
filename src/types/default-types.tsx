import { ToolkitTableIconsTable, ToolkitTableLabelsTable } from "./table-types";
import { ChevronRightIcon, PlusIcon, TableIcon } from "lucide-react";

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
};

export const DefaultToolkitTableIcons: ToolkitTableIconsTable = {
  breadcrumbIcon: <TableIcon className="h-5 w-5" />,
  breadcrumbArrow: <ChevronRightIcon className="h-4 w-4" />,
  addButton: <PlusIcon className="mr-2 h-4 w-4" />,
};
