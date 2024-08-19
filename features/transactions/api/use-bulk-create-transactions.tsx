import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { CircleX, CircleCheck } from "lucide-react";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-create"]["$post"]({
        json,
      });

      if (!response.ok) throw new Error();
      return await response.json();
    },
    onSuccess: () => {
      toast.success(`Successfully created transaction(s)!`, {
        icon: <CircleCheck color="green" />,
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Couldn't create transaction(s)...", {
        icon: <CircleX color="red" />,
      });
    },
  });

  return mutation;
};

export default useBulkCreateTransactions;
