import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Table } from "@tanstack/react-table";
import { Settings2, RotateCcw } from "lucide-react";
import { TablePreferences } from "@/lib/types/table-types";

interface SettingsDialogProps<TData> {
  table: Table<TData>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: TablePreferences;
  onPreferencesChange: (preferences: TablePreferences) => void;
}

export function SettingsDialog<TData>({
  table,
  open,
  onOpenChange,
  preferences,
  onPreferencesChange,
}: SettingsDialogProps<TData>) {
  const resetPreferences = () => {
    const defaultPreferences: TablePreferences = {
      theme: "light",
      density: "normal",
      columnVisibility: {},
    };
    onPreferencesChange(defaultPreferences);
    localStorage.removeItem("tablePreferences");
  };

  const updatePreference = (key: keyof TablePreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    onPreferencesChange(newPreferences);
    localStorage.setItem("tablePreferences", JSON.stringify(newPreferences));
  };

  useEffect(() => {
    if (preferences.theme) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(preferences.theme);
    }
  }, [preferences.theme]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fluent-glass sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Table Settings
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Switch
                id="theme-toggle"
                checked={preferences.theme === "dark"}
                onCheckedChange={(checked) =>
                  updatePreference("theme", checked ? "dark" : "light")
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Row Density</Label>
              <Select
                value={preferences.density}
                onValueChange={(value) =>
                  updatePreference("density", value as "compact" | "normal")
                }
              >
                <SelectTrigger className="fluent-input w-full">
                  <SelectValue placeholder="Select density" />
                </SelectTrigger>
                <SelectContent className="fluent-glass">
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visible Columns</Label>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-4">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <div
                          key={column.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(checked) => {
                              column.toggleVisibility(!!checked);
                              const newVisibility = {
                                ...preferences.columnVisibility,
                                [column.id]: !!checked,
                              };
                              updatePreference(
                                "columnVisibility",
                                newVisibility
                              );
                            }}
                          />
                          <Label htmlFor={column.id} className="capitalize">
                            {column.id}
                          </Label>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Button
            variant="outline"
            className="fluent-button-secondary"
            onClick={resetPreferences}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
