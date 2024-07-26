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
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  receiver: z.string(),
  amount: z.string(),
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
          name="receiver"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add a receiver"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
            </FormItem>
          )}
        />
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
                  changeOption={field.onChange}
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
                  changeOption={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={false}
                />
              </FormControl>
            </FormItem>
          )}
        />{" "}
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Add notes (optional)"
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
