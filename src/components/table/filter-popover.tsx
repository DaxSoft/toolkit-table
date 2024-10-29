import { useState, useCallback } from "react";
import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { FilterValue, filterOperators } from "@/lib/filters";
import { CalendarIcon, FilterX, Search } from "lucide-react";

interface FilterPopoverProps<TData> {
  column: Column<TData>;
  filterValue: FilterValue | null;
  onFilterChange: (value: FilterValue | null) => void;
}

export function FilterPopover<TData extends Record<any, any>>({
  column,
  filterValue,
  onFilterChange,
}: FilterPopoverProps<TData>) {
  const [open, setOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState<FilterValue | null>(
    filterValue
  );

  const columnDef = column.columnDef as any;

  const columnType =
    (columnDef.meta?.type as "string" | "number" | "date") || "string";

  const handleApplyFilter = useCallback(() => {
    if (
      !localFilter?.operator ||
      (!localFilter?.value && localFilter?.value !== 0)
    ) {
      handleClearFilter();
      return;
    }
    onFilterChange(localFilter);
    setOpen(false);
  }, [localFilter, onFilterChange]);

  const handleClearFilter = useCallback(() => {
    setLocalFilter(null);
    onFilterChange(null);
    setOpen(false);
  }, [onFilterChange]);

  const handleOperatorChange = useCallback((operator: string) => {
    if (!operator) {
      setLocalFilter(null);
      return;
    }
    setLocalFilter({
      operator: operator as FilterValue["operator"],
      value: "",
      valueTo: undefined,
      caseSensitive: false,
    });
  }, []);

  const renderFilterInput = useCallback(() => {
    if (!localFilter?.operator) return null;

    switch (columnType) {
      case "date":
        return (
          <div className="grid gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Start Date</span>
              </div>
              <Calendar
                mode="single"
                selected={
                  localFilter.value
                    ? new Date(localFilter.value as string)
                    : undefined
                }
                onSelect={(date) =>
                  setLocalFilter({
                    ...localFilter,
                    value: date?.toISOString(),
                  })
                }
                className="rounded-md border"
              />
            </div>
            {localFilter.operator === "between" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">End Date</span>
                </div>
                <Calendar
                  mode="single"
                  selected={
                    localFilter.valueTo
                      ? new Date(localFilter.valueTo as string)
                      : undefined
                  }
                  onSelect={(date) =>
                    setLocalFilter({
                      ...localFilter,
                      valueTo: date?.toISOString(),
                    })
                  }
                  className="rounded-md border"
                />
              </div>
            )}
          </div>
        );

      case "number":
        return (
          <div className="grid gap-2">
            <Input
              type="number"
              value={localFilter.value?.toString() || ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? "" : Number(e.target.value);
                setLocalFilter({
                  ...localFilter,
                  value: value,
                });
              }}
              placeholder="Enter value"
              className="fluent-input"
            />
            {localFilter.operator === "between" && (
              <Input
                type="number"
                value={localFilter.valueTo?.toString() || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  setLocalFilter({
                    ...localFilter,
                    valueTo: value,
                  });
                }}
                placeholder="Enter end value"
                className="fluent-input"
              />
            )}
          </div>
        );

      default:
        return (
          <div className="grid gap-2">
            <Input
              value={localFilter.value?.toString() || ""}
              onChange={(e) =>
                setLocalFilter({
                  ...localFilter,
                  value: e.target.value,
                })
              }
              placeholder="Enter value"
              className="fluent-input"
            />
            <div className="flex items-center space-x-2">
              <Switch
                checked={localFilter.caseSensitive || false}
                onCheckedChange={(checked) =>
                  setLocalFilter({
                    ...localFilter,
                    caseSensitive: checked,
                  })
                }
              />
              <span className="text-sm">Case sensitive</span>
            </div>
          </div>
        );
    }
  }, [columnType, localFilter]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${filterValue ? "text-primary" : ""}`}
        >
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 fluent-glass">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter {column.id}</h4>
            <p className="text-sm text-muted-foreground">
              Add a filter for this column
            </p>
          </div>
          <div className="grid gap-2">
            <Select
              value={localFilter?.operator || ""}
              onValueChange={handleOperatorChange}
            >
              <SelectTrigger className="fluent-input">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent className="fluent-glass">
                {filterOperators[columnType].map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderFilterInput()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="flex-1 fluent-button"
              onClick={handleApplyFilter}
              disabled={!localFilter?.operator}
            >
              Apply Filter
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilter}
              disabled={!filterValue}
              className="fluent-button-secondary"
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
