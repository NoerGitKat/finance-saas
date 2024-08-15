"use client";

import useGetSummary from "@/features/summary/api/use-get-summary";
import { Chart } from "./chart";

export const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) return <div>loading...</div>;

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-6">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
    </section>
  );
};
