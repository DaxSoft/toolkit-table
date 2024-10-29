import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { format, formatDistanceStrict } from "date-fns";
import { cn } from "@/lib/utils";

interface CellComparisonProps {
  value: any;
  nextValue: any;
  type: "number" | "date" | "string";
}

export function CellComparison({
  value,
  nextValue,
  type,
}: CellComparisonProps) {
  if (!nextValue || type === "string") {
    return null;
  }

  if (type === "date") {
    const currentDate = new Date(value);
    const nextDate = new Date(nextValue);
    const isIncreasing = currentDate > nextDate;
    const distance = formatDistanceStrict(currentDate, nextDate, {
      addSuffix: false,
    });

    return (
      <span
        className={cn(
          "ml-2 inline-flex items-center text-xs",
          isIncreasing
            ? "text-green-500 dark:text-green-400"
            : "text-red-500 dark:text-red-400"
        )}
      >
        {isIncreasing ? (
          <ArrowUp className="mr-1 h-3 w-3" />
        ) : (
          <ArrowDown className="mr-1 h-3 w-3" />
        )}
        {distance}
      </span>
    );
  }

  if (type === "number") {
    const diff = ((value - nextValue) / nextValue) * 100;
    const formattedDiff = Math.abs(diff).toFixed(1);

    if (diff === 0) {
      return (
        <span className="ml-2 inline-flex items-center text-xs text-muted-foreground">
          <Minus className="mr-1 h-3 w-3" />
          <span>0%</span>
        </span>
      );
    }

    return (
      <span
        className={cn(
          "ml-2 inline-flex items-center text-xs",
          diff > 0
            ? "text-green-500 dark:text-green-400"
            : "text-red-500 dark:text-red-400"
        )}
      >
        {diff > 0 ? (
          <ArrowUp className="mr-1 h-3 w-3" />
        ) : (
          <ArrowDown className="mr-1 h-3 w-3" />
        )}
        <span>{formattedDiff}%</span>
      </span>
    );
  }

  return null;
}
