"use client";

import { Button } from "@/components/ui/button";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import { SignOutButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data, isLoading } = useGetAccounts();

  if (isLoading) {
    return (
      <div>
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <>
      <p>This is an auth route</p>
      <div>
        {data?.accounts && data.accounts.length > 0
          ? data.accounts.map((account) => (
              <div key={account.id}>{account.name}</div>
            ))
          : "nothing"}
      </div>
      <SignOutButton redirectUrl="/login">
        <Button variant="destructive">Sign out</Button>
      </SignOutButton>
    </>
  );
}
