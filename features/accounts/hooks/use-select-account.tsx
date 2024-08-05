import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import useCreateorEditAccount from "@/features/accounts/api/use-create-edit-account";
import { Select } from "@/components/select";

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<string | undefined>,
] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateorEditAccount();
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const createAccount = (name: string) => accountMutation.mutate({ name });

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);
  const selectValue = useRef<string>();

  const confirmAction = (): Promise<string | undefined> =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleAction = (value: string | undefined) => {
    promise?.resolve(value);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <Dialog open={promise !== null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select account</DialogTitle>
            <DialogDescription>
              Please select an account to continue importing.
            </DialogDescription>
          </DialogHeader>
          <Select
            placeholder="Select an account"
            options={accountOptions}
            createAccountOption={createAccount}
            changeOption={(value) => (selectValue.current = value)}
            disabled={accountQuery.isLoading || accountMutation.isPending}
          />
          <DialogFooter>
            <Button onClick={() => handleAction(undefined)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => handleAction(selectValue.current)}
              disabled={accountQuery.isLoading || accountMutation.isPending}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmationDialog, confirmAction];
};
