import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Loader2 } from "lucide-react";

import { useConfirmAction } from "@/hooks";
import { useTransaction } from "../hooks/use-transaction";
import useGetTransaction from "../api/use-get-transaction";
import useCreateorEditTransaction from "../api/use-create-edit-transaction";
import useDeleteTransaction from "../api/use-delete-transaction";
import { ApiFormValues, TransactionForm } from "./transaction-form";
import useGetCategories from "@/features/categories/api/use-get-categories";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import useCreateOrEditCategory from "@/features/categories/api/use-create-edit-category";
import useCreateorEditAccount from "@/features/accounts/api/use-create-edit-account";
import {
  convertAmountFromMiliunits,
  convertAmountToMiliunits,
} from "@/lib/utils";

export const EditTransactionSheet = () => {
  const { isOpen, closeModal, id } = useTransaction();
  const [ConfirmationDialog, confirmAction] = useConfirmAction(
    "Are you sure?",
    `You are about to delete`,
    "this transaction",
  );

  const transactionQuery = useGetTransaction(id);
  const editTransactionMutation = useCreateorEditTransaction(id);
  const deleteTransactionMutation = useDeleteTransaction(id);

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId || "",
        categoryId: transactionQuery.data.categoryId,
        amount: String(
          convertAmountFromMiliunits(transactionQuery.data.amount),
        ),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        receiver: transactionQuery.data.receiver,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: 0,
        date: new Date(),
        receiver: "",
        notes: "",
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

  const isPending =
    editTransactionMutation.isPending ||
    deleteTransactionMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    categoryQuery.isLoading ||
    accountQuery.isLoading ||
    transactionQuery.isLoading;

  const editTransaction = (values: ApiFormValues) => {
    const amount = parseFloat(values.amount.toString());
    const amountInMiliunits = convertAmountToMiliunits(amount);

    const formValues = {
      ...values,
      amount: amountInMiliunits,
    };

    editTransactionMutation.mutate(formValues, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const deleteTransaction = async () => {
    const isConfirmed = await confirmAction();

    if (isConfirmed) {
      deleteTransactionMutation.mutate(undefined, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={closeModal}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit this transaction.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={editTransaction}
              disabled={isPending}
              defaultValues={defaultValues}
              createNewAccount={createNewAccount}
              createNewCategory={createNewCategory}
              onDelete={deleteTransaction}
              categoryOptions={categoryOptions}
              accountOptions={accountOptions}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
