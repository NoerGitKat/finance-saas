"use client";

import useGetSummary from "@/features/summary/api/use-get-summary";
import { Chart } from "./chart";
import { Pie } from "./pie";
import { ChartLoading } from "./chart-loading";

export const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-6">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        {isLoading ? <ChartLoading /> : <Chart data={data?.days} />}
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        {isLoading ? <ChartLoading /> : <Pie data={data?.categories.all} />}
      </div>
    </section>
  );
};
