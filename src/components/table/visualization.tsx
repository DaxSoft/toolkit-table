import useMediaQuery from "@/hooks/use-media-query";
import { ToolkitTableProps } from "@/types/table-types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { cn } from "@/lib/utils";
import { DataPoint, PremiumChartCard } from "./chart";
import { useMemo } from "react";
import { DefaultToolkitTableLabelsVisualization } from "@/types/default-types";

const sampleData: DataPoint[] = [
  { category: "Jan", value: 1200 },
  { category: "Feb", value: 1900 },
  { category: "Mar", value: 1600 },
  { category: "Apr", value: 2100 },
  { category: "May", value: 2400 },
  { category: "Jun", value: 1800 },
  { category: "Jul", value: 2800 },
  { category: "Aug", value: 3200 },
  { category: "Sep", value: 2900 },
  { category: "Oct", value: 3500 },
  { category: "Nov", value: 3100 },
  { category: "Dec", value: 3800 },
];

export function TableVisualization<ColumnData>({
  showVisualizationDialog,
  setShowVisualizationDialog,
  tableProps,
}: {
  showVisualizationDialog: boolean;
  setShowVisualizationDialog: React.Dispatch<React.SetStateAction<boolean>>;
  tableProps: ToolkitTableProps<ColumnData>;
}) {
  const tableLabels = useMemo(
    () => ({
      ...DefaultToolkitTableLabelsVisualization,
      ...tableProps?.label?.visualization,
    }),
    [tableProps?.label]
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <>
        <Dialog
          open={showVisualizationDialog}
          onOpenChange={setShowVisualizationDialog}
        >
          <DialogContent
            className={cn(["windows11-mica fluent-glass sm:max-w-[960px]"])}
          >
            <DialogHeader>
              <DialogTitle>Visualization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <ScrollArea className="h-[70vh] rounded-md p-4">
                <PremiumChartCard
                  title="Monthly Revenue Analytics"
                  data={sampleData}
                  className="w-full"
                />
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowVisualizationDialog(false)}
                className="fluent-button-secondary"
              >
                {tableLabels.goBack}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Drawer
      open={showVisualizationDialog}
      onOpenChange={setShowVisualizationDialog}
    >
      <DrawerContent className="fluent-glass">
        <DrawerHeader className="text-left">
          <DrawerTitle>{tableLabels.title}</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 py-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <PremiumChartCard
              title="Monthly Revenue Analytics"
              data={sampleData}
              className="w-full"
            />
          </ScrollArea>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => setShowVisualizationDialog(false)}
              className="fluent-button-secondary"
            >
              {tableLabels.goBack}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
