import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAccount } from "@/features/accounts/hooks/use-account";
import { AccountForm, FormValues } from "./account-form";
import useCreateorEditAccount from "@/features/accounts/api/use-create-edit-account";
import useGetAccount from "../api/use-get-account";
import { Loader2 } from "lucide-react";

export const EditAccountSheet = () => {
  const { isOpen, closeModal, id } = useAccount();

  const { data: currentAccount, isLoading } = useGetAccount(id);
  const mutation = useCreateorEditAccount(id);
  let defaultValues = {
    name: "",
  };

  const editAccount = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  if (currentAccount) {
    defaultValues = {
      name: currentAccount.name,
    };
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeModal}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>Edit this existing account.</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <AccountForm
            id={id}
            onSubmit={editAccount}
            disabled={mutation.isPending}
            defaultValues={defaultValues}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
