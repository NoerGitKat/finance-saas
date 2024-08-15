import { useState } from "react";

export const useSwitchChart = (type: string) => {
  const [chartType, setChartType] = useState<string>(type);

  const switchChart = (type: string) => {
    // TODO: Add paywall

    setChartType(type);
  };

  return { chartType, switchChart };
};
