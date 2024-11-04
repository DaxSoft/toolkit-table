import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEcharts } from "@/hooks/use-echarts";
import { useViewportDimensions } from "@/hooks/use-viewport";
import { cn } from "@/lib/utils";
import { EChartsOption } from "echarts";
import { ReactNode, useEffect } from "react";

export interface DataPoint {
  category: string;
  value: number;
}

export type ChartCustomCardProps = {
  title: ReactNode;
  data: Record<string, any>[];
  className?: string;
  chart: (data: Record<string, any>[]) => EChartsOption;
};

export function ChartCustomCard({
  title,
  data,
  className,
  chart,
}: ChartCustomCardProps) {
  const { dupData, echarts, graphicId, myChart } = useEcharts("chart", {});
  const { width } = useViewportDimensions();

  useEffect(() => {
    if (dupData === true && !!myChart) {
      myChart.setOption(chart(data));

      myChart.resize({
        width: "auto",
        height: "auto",
      });
    }
  }, [data, dupData, chart]);

  useEffect(() => {
    if (dupData === true && !!myChart) {
      myChart.resize({
        width: "auto",
        height: "auto",
      });
    }
  }, [width]);

  return (
    <Card
      className={cn(
        "backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 transition-all duration-200 hover:shadow-lg",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id={graphicId} className="h-[300px] w-full"></div>
      </CardContent>
    </Card>
  );
}
