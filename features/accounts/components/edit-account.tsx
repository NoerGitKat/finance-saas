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
import useDeleteAccount from "../api/use-delete-account";
import { useConfirmAction } from "@/hooks";

export const EditAccountSheet = () => {
  const { isOpen, closeModal, id } = useAccount();
  const [ConfirmationDialog, confirmAction] = useConfirmAction(
    "Are you sure?",
    `You are about to delete`,
    "this account",
  );

  const { data: currentAccount, isLoading } = useGetAccount(id);
  const editMutation = useCreateorEditAccount(id);
  let defaultValues = {
    name: "",
  };
  const deleteMutation = useDeleteAccount(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const editAccount = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const deleteAccount = async () => {
    const isConfirmed = await confirmAction();

    if (isConfirmed) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  if (currentAccount) {
    defaultValues = {
      name: currentAccount.name,
    };
  }

  return (
    <>
      <ConfirmationDialog />
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
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={deleteAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
