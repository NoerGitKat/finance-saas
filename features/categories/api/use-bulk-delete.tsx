import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { CircleX, CircleCheck } from "lucide-react";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];

const useBulkDelete = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success(`Successfully deleted category/categories!`, {
        icon: <CircleCheck color="green" />,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // TODO: Also invalidate summary
    },
    onError: () => {
      toast.error("Couldn't delete category/categories...", {
        icon: <CircleX color="red" />,
      });
    },
  });

  return mutation;
};

export default useBulkDelete;
