"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, Loader2, Plus } from "lucide-react";
import { columns } from "@/app/(dashboard)/transactions/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import useGetTransactions from "@/features/transactions/api/use-get-transactions";
import useBulkDeleteTransactions from "@/features/transactions/api/use-bulk-delete-transactions";
import { useImportCSV } from "@/hooks";
import { Variants } from "@/constants/enums";
import { CsvUploadButton } from "./csv-upload-button";
import { ImportCard } from "./import-card";
import { NewTransaction } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import useBulkCreateTransactions from "@/features/transactions/api/use-bulk-create-transactions";

const TransactionsPage = () => {
  const [ConfirmationDialog, confirmAction] = useSelectAccount();
  const { toggleSheet } = useNewTransaction();
  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const createTransactions = useBulkCreateTransactions();
  const { variant, uploadCSV, importResults, cancelImport } = useImportCSV();

  const storeTransactionsInDB = async (data: NewTransaction[]) => {
    try {
      const accountId = await confirmAction();

      if (!accountId) {
        return toast.error("Please select an account to continue.");
      }

      const importedTransactions = data.map((transaction) => {
        return {
          ...transaction,
          accountId,
        };
      });

      createTransactions.mutate(importedTransactions, {
        onSuccess: () => {
          cancelImport();
        },
      });
    } catch (error) {
      return toast.error(
        (error as string) || "Something went wrong. Try again later.",
      );
    }
  };

  if (variant === Variants.IMPORT)
    return (
      <section className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <ConfirmationDialog />
        <ImportCard
          data={importResults.data}
          cancelImport={cancelImport}
          storeTransactionsInDB={storeTransactionsInDB}
        />
      </section>
    );

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  return (
    <section className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        {transactionsQuery.isLoading ? (
          <>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex h-[500px] w-full items-center justify-center">
                <Loader2 className="size-6 animate-spin text-slate-300" />
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="line-clamp-1 flex text-xl">
                <ArrowLeftRight className="mr-2" />
                Transactions
              </CardTitle>
              <aside className="flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2">
                <Button
                  onClick={toggleSheet}
                  size="sm"
                  className="w-full lg:w-auto"
                >
                  <Plus className="mr-2 size-4" /> Add new
                </Button>
                <CsvUploadButton uploadCSV={uploadCSV} />
              </aside>
            </CardHeader>
            <CardContent>
              {transactionsQuery.data && (
                <DataTable
                  columns={columns}
                  data={transactionsQuery.data}
                  filterKey="receiver"
                  onDelete={(row) => {
                    const ids = row.map(
                      (transaction) => transaction.original.id,
                    );
                    deleteTransactions.mutate({ ids });
                  }}
                  disabled={isDisabled}
                />
              )}
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
};

export default TransactionsPage;
