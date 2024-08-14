import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useGetSummary = () => {
  const params = useSearchParams();
  const fromDate = params.get("fromDate") || "";
  const toDate = params.get("toDate") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    // TODO: Check if params are necessary in key
    queryKey: ["summary", { fromDate, toDate, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: { fromDate, toDate, accountId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary!");
      }

      const { summary } = await response.json();

      return {
        ...summary,
        currentPeriod: {
          income: convertAmountFromMiliunits(summary.currentPeriod.income),
          expenses: convertAmountFromMiliunits(summary.currentPeriod.expenses),
          remaining: convertAmountFromMiliunits(
            summary.currentPeriod.remaining,
          ),
        },
        lastPeriod: {
          income: convertAmountFromMiliunits(summary.lastPeriod.income),
          expenses: convertAmountFromMiliunits(summary.lastPeriod.expenses),
          remaining: convertAmountFromMiliunits(summary.lastPeriod.remaining),
        },
        categories: {
          top: summary.categories.top.map((category) =>
            convertAmountFromMiliunits(category.value),
          ),
          other: {
            ...summary.categories.other,
            value: convertAmountFromMiliunits(summary.categories.other.value),
          },
        },
        days: summary.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        })),
      };
    },
  });

  return query;
};

export default useGetSummary;
