import { create } from "zustand";

interface ChartState {
  chartData: any[];
  chartConfig: any;
  setChartData: (data: any[]) => void;
  setChartConfig: (config: any) => void;
}

export const useChartStore = create<ChartState>((set) => ({
  chartData: [],
  chartConfig: {},
  setChartData: (data) => set({ chartData: data }),
  setChartConfig: (config) => set({ chartConfig: config }),
}));
