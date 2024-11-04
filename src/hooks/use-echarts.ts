import { useState, useEffect } from "react";
import * as echarts from "echarts";

export function useEcharts(id: string, opts: Record<any, any> = {}) {
  const [myChart, setMyChart] = useState<echarts.ECharts | null>(null);
  const [dupData, setDupData] = useState<boolean>(false);

  useEffect(() => {
    if (!!document) {
      const chartDom = document.getElementById(id);
      if (chartDom && !myChart) {
        const chart = echarts.init(chartDom, opts);
        setDupData(true);
        setMyChart(chart);
      }
    }
  }, [typeof document]);

  return {
    dupData,
    myChart,
    graphicId: id,
    echarts,
  };
}
