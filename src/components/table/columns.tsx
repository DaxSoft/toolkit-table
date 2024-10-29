import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Pin,
  PinOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { FilterPopover } from "./filter-popover";

type IsSortedType = "false" | "asc" | "desc";

export const SortButton = ({
  column,
  children,
}: {
  column: any;
  children: React.ReactNode;
}) => {
  const isSorted = column.getIsSorted() as IsSortedType;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-transparent"
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      {children}
      {
        {
          asc: <ArrowUp className="ml-2 h-4 w-4" />,
          desc: <ArrowDown className="ml-2 h-4 w-4" />,
          false: <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />,
        }[isSorted || "false"]
      }
    </Button>
  );
};
