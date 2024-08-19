import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useGetTransactions = () => {
  const params = useSearchParams();
  const fromDate = params.get("from") || "";
  const toDate = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["transactions", { from: fromDate, to: toDate, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: { from: fromDate, to: toDate, accountId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions!");
      }

      const { transactions } = await response.json();
      return transactions;
    },
  });

  return query;
};

export default useGetTransactions;
