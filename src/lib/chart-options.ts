import { ChartType } from "./types/chart-types";
import { format } from "date-fns";

export function getChartOptions(type: ChartType, data: any[], config: any) {
  const baseOptions = {
    title: {
      text: config.title,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      show: config.showLegend,
      bottom: "5%",
    },
  };

  switch (type) {
    case "line":
    case "bar":
      return {
        ...baseOptions,
        xAxis: {
          type: "category",
          data: data.map((item) => {
            const value = item[config.xAxis];
            return value instanceof Date ? format(value, "PP") : value;
          }),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: config.yAxis,
            type,
            stack: config.stack ? "total" : undefined,
            data: data.map((item) => item[config.yAxis]),
            emphasis: {
              focus: "series",
            },
          },
        ],
      };

    case "pie":
      return {
        ...baseOptions,
        series: [
          {
            name: config.valueField,
            type: "pie",
            radius: "50%",
            data: data.map((item) => ({
              name: item[config.labelField],
              value: item[config.valueField],
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

    case "scatter":
      return {
        ...baseOptions,
        xAxis: { type: "value", name: config.xAxis },
        yAxis: { type: "value", name: config.yAxis },
        series: [
          {
            type: "scatter",
            symbolSize: config.sizeField ? (data: any[]) => data[2] * 20 : 20,
            data: data.map((item) => [
              item[config.xAxis],
              item[config.yAxis],
              config.sizeField ? item[config.sizeField] : null,
            ]),
            emphasis: {
              focus: "series",
            },
          },
        ],
      };

    case "gauge":
      return {
        ...baseOptions,
        series: [
          {
            type: "gauge",
            min: config.min,
            max: config.max,
            data: [
              {
                value:
                  data.reduce(
                    (acc: number, item: any) =>
                      acc + Number(item[config.valueField]),
                    0
                  ) / data.length,
                name: config.valueField,
              },
            ],
          },
        ],
      };

    default:
      return baseOptions;
  }
}
