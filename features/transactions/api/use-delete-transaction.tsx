import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { CircleX, CircleCheck } from "lucide-react";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.transactions[":id"]["$delete"]({
        param: { id },
      });
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success(`Successfully deleted transaction!`, {
        icon: <CircleCheck color="green" />,
      });
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Couldn't delete transaction...", {
        icon: <CircleX color="red" />,
      });
    },
  });

  return mutation;
};

export default useDeleteTransaction;
