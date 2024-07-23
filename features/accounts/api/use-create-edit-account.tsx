import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { CircleX, CircleCheck } from "lucide-react";

type CreateResponseType = InferResponseType<typeof client.api.accounts.$post>;
type CreateRequestType = InferRequestType<
  typeof client.api.accounts.$post
>["json"];
type EditResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$patch"]
>;
type EditRequestType = InferRequestType<
  typeof client.api.accounts.$post
>["json"];

const useCreateorEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateResponseType | EditResponseType,
    Error,
    CreateRequestType | EditRequestType
  >({
    mutationFn: async (json) => {
      if (id) {
        const response = await client.api.accounts[":id"]["$patch"]({
          param: { id },
          json,
        });
        return await response.json();
      }
      const response = await client.api.accounts.$post({ json });
      return await response.json();
    },
    onSuccess: (_data, { name }) => {
      toast.success(
        `Successfully ${id ? "edited" : "created"} account: ${name}!`,
        {
          icon: <CircleCheck color="green" />,
        },
      );
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      }
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error(`Couldn't ${id ? "edit" : "create"} account...`, {
        icon: <CircleX color="red" />,
      });
    },
  });

  return mutation;
};

export default useCreateorEditAccount;
