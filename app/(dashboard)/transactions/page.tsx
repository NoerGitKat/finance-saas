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

const TransactionsPage = () => {
  const { toggleSheet } = useNewTransaction();
  const { data, isLoading } = useGetTransactions();
  const { mutate, isPending } = useBulkDeleteTransactions();
  const { variant, uploadCSV, importResults, cancelImport } = useImportCSV();

  console.log("importResults", importResults);

  if (variant === Variants.IMPORT)
    return (
      <section className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <ImportCard
          data={importResults.data}
          cancelImport={cancelImport}
          importFile={() => {}}
        />
      </section>
    );

  const isDisabled = isLoading || isPending;

  return (
    <section className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        {isLoading ? (
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
              <aside className="flex items-center gap-x-4">
                <Button onClick={toggleSheet} size="sm">
                  <Plus className="mr-2 size-4" /> Create new transaction
                </Button>
                <CsvUploadButton uploadCSV={uploadCSV} />
              </aside>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={columns}
                  data={data}
                  filterKey="receiver"
                  onDelete={(row) => {
                    const ids = row.map(
                      (transaction) => transaction.original.id,
                    );
                    mutate({ ids });
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
