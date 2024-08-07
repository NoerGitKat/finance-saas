"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { BadgeEuro, Loader2, Plus } from "lucide-react";
import { columns } from "@/app/(dashboard)/accounts/columns";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import useBulkDelete from "@/features/accounts/api/use-bulk-delete";

const AccountsPage = () => {
  const { toggleSheet } = useNewAccount();
  const { data, isLoading } = useGetAccounts();
  const { mutate, isPending } = useBulkDelete();

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
                <BadgeEuro className="mr-2" /> Current Accounts
              </CardTitle>
              <Button onClick={toggleSheet} size="sm">
                <Plus className="mr-2 size-4" /> Create new account
              </Button>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={columns}
                  data={data}
                  filterKey="name"
                  onDelete={(row) => {
                    const ids = row.map((account) => account.original.id);
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

export default AccountsPage;
