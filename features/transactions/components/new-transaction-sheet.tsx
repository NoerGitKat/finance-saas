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

export const NewTransactionSheet = () => {
  const { isOpen, toggleSheet } = useNewTransaction();

  const defaultValues = {
    receiver: "",
    amount: 0,
    date: new Date(),
    accountId: "",
  };
  const transactionMutation = useCreateorEditTransaction();

  const createNewTransaction = (values: ApiFormValues) => {
    transactionMutation.mutate(values, {
      onSuccess: () => {
        toggleSheet();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a new transaction.</SheetDescription>
        </SheetHeader>
        <TransactionForm
          onSubmit={createNewTransaction}
          disabled={transactionMutation.isPending}
          defaultValues={defaultValues}
        />
      </SheetContent>
    </Sheet>
  );
};
