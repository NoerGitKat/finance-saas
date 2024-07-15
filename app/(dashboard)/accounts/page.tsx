"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Plus } from "lucide-react";
import { columns } from "@/app/(dashboard)/accounts/columns";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";

const AccountsPage = () => {
  const { toggleSheet } = useNewAccount();
  const { data } = useGetAccounts();

  return (
    <section className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">
            Current Accounts
          </CardTitle>
          <Button onClick={toggleSheet} size="sm">
            <Plus className="mr-2 size-4" /> Create new account
          </Button>
        </CardHeader>
        <CardContent>
          {data && (
            <DataTable
              columns={columns}
              data={data.accounts}
              filterKey="name"
              deleteRows={() => {}}
              disabled={false}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default AccountsPage;
