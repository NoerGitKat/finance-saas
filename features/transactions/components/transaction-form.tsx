import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { insertTransactionSchema } from "@/db/schema/transactions";
import { Select } from "@/components/select";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  receiver: z.string(),
  amount: z.number(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({
  id: true,
});

export type FormValues = z.input<typeof formSchema>;
export type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  categoryOptions: {
    label: string;
    value: string;
  }[];
  accountOptions: {
    label: string;
    value: string;
  }[];
  createNewCategory: (name: string) => void;
  createNewAccount: (name: string) => void;
  disabled?: boolean;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  categoryOptions,
  accountOptions,
  createNewCategory,
  createNewAccount,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  createAccountOption={createNewAccount}
                  value={field.value}
                  disabled={disabled}
                  changeOption={() => {}}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  options={categoryOptions}
                  createAccountOption={createNewCategory}
                  value={field.value}
                  disabled={disabled}
                  changeOption={() => {}}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button variant="default" disabled={disabled}>
          {id ? "Save changes" : "Create transaction"}
        </Button>
        {!!id && (
          <Button
            type="button"
            variant="destructive"
            disabled={disabled}
            onClick={onDelete}
          >
            <Trash className="mr-2 size-4" />
            Delete transaction
          </Button>
        )}
      </form>
    </Form>
  );
};
