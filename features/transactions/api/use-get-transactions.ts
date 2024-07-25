import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useGetTransactions = () => {
  const params = useSearchParams();
  const fromDate = params.get("fromDate") || "";
  const toDate = params.get("toDate") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    // TODO: Check if params are necessary in key
    queryKey: ["transactions", { fromDate, toDate, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: { fromDate, toDate, accountId },
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
