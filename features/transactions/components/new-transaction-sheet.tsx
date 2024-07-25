import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import useCreateorEditTransaction from "@/features/transactions/api/use-create-edit-transaction";
import { useNewTransaction } from "../hooks/use-new-transaction";
import { ApiFormValues, TransactionForm } from "./transaction-form";
import useCreateOrEditCategory from "@/features/categories/api/use-create-edit-category";
import useCreateorEditAccount from "@/features/accounts/api/use-create-edit-account";
import useGetCategories from "@/features/categories/api/use-get-categories";
import { Loader2 } from "lucide-react";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";

export const NewTransactionSheet = () => {
  const { isOpen, toggleSheet } = useNewTransaction();

  const defaultValues = {
    receiver: "",
    amount: 0,
    date: new Date(),
    accountId: "",
  };

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateOrEditCategory();
  const createNewCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateorEditAccount();
  const createNewAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const transactionMutation = useCreateorEditTransaction();

  const createNewTransaction = (values: ApiFormValues) => {
    transactionMutation.mutate(values, {
      onSuccess: () => {
        toggleSheet();
      },
    });
  };

  const isPending =
    accountMutation.isPending ||
    categoryMutation.isPending ||
    transactionMutation.isPending;

  const isLoading = accountQuery.isLoading || categoryQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={toggleSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a new transaction.</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={createNewTransaction}
            disabled={isPending}
            defaultValues={defaultValues}
            createNewAccount={createNewAccount}
            createNewCategory={createNewCategory}
            accountOptions={accountOptions}
            categoryOptions={categoryOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
