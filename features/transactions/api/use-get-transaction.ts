import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

const useGetTransaction = (id?: string) => {
  const query = useQuery({
    // TODO: Check if params are necessary in key
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction!");
      }

      const { transaction } = await response.json();
      return transaction;
    },
  });

  return query;
};

export default useGetTransaction;
