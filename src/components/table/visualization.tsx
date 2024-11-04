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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { cn } from "@/lib/utils";
import { DataPoint, ChartNumberCard } from "./chart-number";
import { useMemo } from "react";
import { DefaultToolkitTableLabelsVisualization } from "@/types/default-types";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { ChartCustomCard } from "./chart-custom";

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

  const visualizations = useMemo(() => {
    const charts = tableProps?.visualizations || {};
    const keys = Object.keys(charts);

    const firstKey = keys[0];

    return (
      <>
        <Tabs defaultValue={firstKey}>
          <TabsList className="grid w-full grid-cols-2">
            {keys.map((key, n) => (
              <TabsTrigger key={`${key}__${n}`} value={key}>
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
          {keys.map((key, n) => {
            const data = charts[key];
            return (
              <TabsContent className="mt-3 -mb-3" value={`${key}_${n}`}>
                <ScrollArea className="h-[60vh] rounded-md ">
                  {data.type === "number" ? (
                    <div>
                      <ChartNumberCard
                        title={data.title}
                        data={data.data}
                        className={cn("w-full")}
                        averageLabel={tableLabels.averageLabel}
                        highestLabel={tableLabels.highestLabel}
                        lowestLabel={tableLabels.lowestLabel}
                        totalLabel={tableLabels.totalLabel}
                      />
                    </div>
                  ) : (
                    <>
                      <ChartCustomCard
                        title={data.title}
                        data={data.data as Record<string, any>[]}
                        className={cn("w-full")}
                        chart={data.chart}
                      />
                    </>
                  )}
                </ScrollArea>
              </TabsContent>
            );
          })}
        </Tabs>
      </>
    );
  }, [tableProps?.visualizations, tableLabels]);

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
              <DialogTitle>{tableLabels.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 px-4">{visualizations}</div>
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
        <div className="space-y-4 py-4">{visualizations}</div>
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
