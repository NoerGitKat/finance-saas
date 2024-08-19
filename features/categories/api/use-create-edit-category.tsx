import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { CircleX, CircleCheck } from "lucide-react";

type CreateResponseType = InferResponseType<typeof client.api.categories.$post>;
type CreateRequestType = InferRequestType<
  typeof client.api.categories.$post
>["json"];
type EditResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
type EditRequestType = InferRequestType<
  typeof client.api.categories.$post
>["json"];

const useCreateOrEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateResponseType | EditResponseType,
    Error,
    CreateRequestType | EditRequestType
  >({
    mutationFn: async (json) => {
      if (id) {
        const response = await client.api.categories[":id"]["$patch"]({
          param: { id },
          json,
        });
        return await response.json();
      }
      const response = await client.api.categories.$post({ json });
      return await response.json();
    },
    onSuccess: (_data, { name }) => {
      toast.success(
        `Successfully ${id ? "edited" : "created"} category: ${name}!`,
        {
          icon: <CircleCheck color="green" />,
        },
      );
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error(`Couldn't ${id ? "edit" : "create"} category...`, {
        icon: <CircleX color="red" />,
      });
    },
  });

  return mutation;
};

export default useCreateOrEditCategory;
