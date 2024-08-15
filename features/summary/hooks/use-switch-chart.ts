import { useState } from "react";

export const useSwitchChart = () => {
  const [chartType, setChartType] = useState<string>("area");

  const switchChart = (type: string) => {
    // TODO: Add paywall

    setChartType(type);
  };

  return { chartType, switchChart };
};
