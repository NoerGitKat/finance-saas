import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { CircleX, CircleCheck } from "lucide-react";

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

const useCreateorEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
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
