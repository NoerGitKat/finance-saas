import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { CircleX, CircleCheck } from "lucide-react";

type CreateResponseType = InferResponseType<
  typeof client.api.transactions.$post
>;
type CreateRequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];
type EditResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type EditRequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];

const useCreateorEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateResponseType | EditResponseType,
    Error,
    CreateRequestType | EditRequestType
  >({
    mutationFn: async (json) => {
      if (id) {
        const response = await client.api.transactions[":id"]["$patch"]({
          param: { id },
          json,
        });

        if (!response.ok) throw new Error("Couldn't edit transaction...");

        return await response.json();
      }
      const response = await client.api.transactions.$post({ json });
      return await response.json();
    },
    onSuccess: (_data, { receiver }) => {
      toast.success(
        `Successfully ${id ? "edited" : "created"} transaction: ${receiver}!`,
        {
          icon: <CircleCheck color="green" />,
        },
      );
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      }
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error(`Couldn't ${id ? "edit" : "create"} transaction...`, {
        icon: <CircleX color="red" />,
      });
    },
  });

  return mutation;
};

export default useCreateorEditTransaction;
