import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { AccountForm, FormValues } from "./account-form";
import useCreateAccount from "@/features/accounts/api/use-create-account";

export const NewAccountSheet = () => {
  const { isOpen, toggleSheet } = useNewAccount();

  const mutation = useCreateAccount();

  const createNewAccount = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toggleSheet();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={createNewAccount}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
