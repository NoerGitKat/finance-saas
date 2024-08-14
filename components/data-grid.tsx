"use client";

import useGetSummary from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DataCard } from "./data-card";
import { DataCardLoading } from "./data-card-loading";

export const DataGrid = () => {
  const params = useSearchParams();
  const { data, isLoading } = useGetSummary();
  const toDate = params.get("toDate") || undefined;
  const fromDate = params.get("fromDate") || undefined;

  const dateRangeLabel = formatDateRange({ toDate, fromDate });

  return (
    <section className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
      {isLoading ? (
        <>
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
        </>
      ) : (
        <>
          <DataCard
            title="Remaining"
            value={data?.currentPeriod.remaining}
            percentageChange={data?.changes.remainingChange}
            icon={PiggyBank}
            variant="default"
            dateRangeLabel={dateRangeLabel}
          />
          <DataCard
            title="Income"
            value={data?.currentPeriod.income}
            percentageChange={data?.changes.incomeChange}
            icon={TrendingUp}
            variant="default"
            dateRangeLabel={dateRangeLabel}
          />
          <DataCard
            title="Expenses"
            value={data?.currentPeriod.expenses}
            percentageChange={data?.changes.expensesChange}
            icon={TrendingDown}
            variant="default"
            dateRangeLabel={dateRangeLabel}
          />
        </>
      )}
    </section>
  );
};
