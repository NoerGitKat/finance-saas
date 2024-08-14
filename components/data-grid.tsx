"use client";

import useGetSummary from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { Loader2, PiggyBank } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DataCard } from "./data-card";

export const DataGrid = () => {
  const params = useSearchParams();
  const { data, isLoading } = useGetSummary();
  const toDate = params.get("toDate") || undefined;
  const fromDate = params.get("fromDate") || undefined;

  const dateRangeLabel = formatDateRange({ toDate, fromDate });

  return (
    <section className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
      {isLoading ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <DataCard
          title="Remaining"
          value={data?.currentPeriod.remaining}
          percentageChange={data?.changes.remainingChange}
          icon={PiggyBank}
          variant="default"
          dateRangeLabel={dateRangeLabel}
        />
      )}
    </section>
  );
};
