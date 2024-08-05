"use client";

import { EditAccountSheet } from "@/features/accounts/components/edit-account";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category";
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction";
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";
import { useTransaction } from "@/features/transactions/hooks/use-transaction";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
  const isMounted = useMountedState();
  const { id } = useTransaction();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
      <NewTransactionSheet />
      {id ? <EditTransactionSheet /> : null}
    </>
  );
};
