import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      const response = await client.api.categories[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch category with ID: ${id}!`);
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetCategory;