import { useState, useEffect, useMemo } from "react";
import { Table } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Download, Loader2 } from "lucide-react";
import { exportToExcel } from "@/lib/export-xlsx";
import { ToolkitTableProps } from "@/types/table-types";
import { DefaultToolkitTableLabelsForm } from "@/types/default-types";

const STORAGE_KEY = "table-export-preferences";

interface ExportDialogProps<TData> {
  table: Table<TData>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableProps: ToolkitTableProps<TData>;
}

export function ExportXlsxDialog<TData>({
  table,
  open,
  onOpenChange,
  tableProps,
}: ExportDialogProps<TData>) {
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [isExporting, setIsExporting] = useState(false);
  const formLabels = useMemo(
    () => ({ ...DefaultToolkitTableLabelsForm, ...tableProps?.label?.form }),
    [tableProps?.label]
  );

  // Load saved preferences
  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      setSelectedFields(JSON.parse(savedPreferences));
    } else {
      // Default to all fields selected
      const defaultFields = table
        .getAllColumns()
        .filter((column) => column.id !== "actions")
        .reduce(
          (acc, column) => ({
            ...acc,
            [column.id]: true,
          }),
          {}
        );
      setSelectedFields(defaultFields);
    }
  }, [table]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToExcel(
        table,
        "users",
        Object.keys(selectedFields).filter((key) => selectedFields[key])
      );
      // Save preferences
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedFields));
      onOpenChange(false);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleAll = (checked: boolean) => {
    const newFields = table
      .getAllColumns()
      .filter((column) => column.id !== "actions")
      .reduce(
        (acc, column) => ({
          ...acc,
          [column.id]: checked,
        }),
        {}
      );
    setSelectedFields(newFields);
  };

  const isAllSelected = Object.values(selectedFields).every(Boolean);
  const isIndeterminate =
    !isAllSelected && Object.values(selectedFields).some(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fluent-glass sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formLabels.export}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onCheckedChange={(checked) => toggleAll(!!checked)}
            />
            <Label htmlFor="select-all">{formLabels.exportSelectFields}</Label>
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {table
                .getAllColumns()
                .filter((column) => column.id !== "actions")
                .map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={selectedFields[column.id] || false}
                      onCheckedChange={(checked) =>
                        setSelectedFields((prev) => ({
                          ...prev,
                          [column.id]: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor={column.id} className="capitalize">
                      {column.id}
                    </Label>
                  </div>
                ))}
            </div>
          </ScrollArea>
          {Object.values(selectedFields).some(Boolean) && (
            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 text-sm font-medium">
                {formLabels.exportSelectFieldsPreview}
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFields)
                  .filter(([_, selected]) => selected)
                  .map(([field]) => (
                    <div
                      key={field}
                      className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                    >
                      {field}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="fluent-button-secondary"
          >
            {formLabels.exportCancel}
          </Button>
          <Button
            onClick={handleExport}
            disabled={
              !Object.values(selectedFields).some(Boolean) || isExporting
            }
            className="fluent-button"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {formLabels.exportContinue}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
