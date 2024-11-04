import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactECharts from "echarts-for-react";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { ReactNode, useMemo } from "react";

export interface DataPoint {
  category: string;
  value: number;
}

interface ChartNumberCardProps {
  title: string;
  data: DataPoint[];
  className?: string;
  highestLabel?: React.ReactNode;
  lowestLabel?: React.ReactNode;
  averageLabel?: React.ReactNode;
  totalLabel?: React.ReactNode;
}

export function ChartNumberCard({
  title,
  data,
  className,
  highestLabel,
  lowestLabel,
  totalLabel,
  averageLabel,
}: ChartNumberCardProps) {
  const stats = useMemo(() => {
    const values = data.map((d) => d.value);
    return {
      highest: Math.max(...values),
      lowest: Math.min(...values),
      average: values.reduce((a, b) => a + b, 0) / values.length,
      total: values.reduce((a, b) => a + b, 0),
    };
  }, [data]);

  const options = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 8,
      padding: 16,
      textStyle: {
        color: "#1f2937",
      },
      formatter: (params: any) => {
        const dataPoint = params[0];
        return `
          <div class="font-medium">${dataPoint.name}</div>
          <div class="text-sm text-gray-500">${dataPoint.value}</div>
        `;
      },
    },
    grid: {
      top: "15%",
      left: "3%",
      right: "4%",
      bottom: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((d) => d.category),
      axisLabel: {
        color: "#6b7280",
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#6b7280",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(229, 231, 235, 0.5)",
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: title,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        sampling: "average",
        itemStyle: {
          color: "#2563eb",
          borderColor: "#ffffff",
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(37, 99, 235, 0.2)",
              },
              {
                offset: 1,
                color: "rgba(37, 99, 235, 0)",
              },
            ],
          },
        },
        emphasis: {
          focus: "series",
          itemStyle: {
            borderWidth: 3,
          },
        },
        data: data.map((d) => d.value),
      },
    ],
  };

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
        <div className="h-[300px] w-full">
          <ReactECharts
            option={options}
            style={{ height: "100%", width: "100%" }}
            className="transition-all duration-300"
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            title={highestLabel}
            value={stats.highest}
            icon={<ArrowUp className="h-4 w-4 text-green-500" />}
          />
          <StatCard
            title={lowestLabel}
            value={stats.lowest}
            icon={<ArrowDown className="h-4 w-4 text-red-500" />}
          />
          <StatCard
            title={averageLabel}
            value={stats.average.toFixed(2)}
            icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
          />
          <StatCard
            title={totalLabel}
            value={stats.total}
            icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  title: React.ReactNode;
  value: number | string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-4 transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
