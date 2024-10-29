import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

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
