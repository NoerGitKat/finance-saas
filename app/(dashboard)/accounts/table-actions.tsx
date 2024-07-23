"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteAccount from "@/features/accounts/api/use-delete-account";
import { useAccount } from "@/features/accounts/hooks/use-account";
import { useConfirmAction } from "@/hooks";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const TableActions = ({ id }: Props) => {
  const { openModal } = useAccount();
  const [ConfirmationDialog, confirmAction] = useConfirmAction(
    "Are you sure?",
    `You are about to delete`,
    "this account",
  );
  const deleteMutation = useDeleteAccount(id);

  const deleteAccount = async () => {
    const isConfirmed = await confirmAction();
    if (isConfirmed) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={deleteMutation.isPending}
            onClick={() => openModal(id)}
          >
            <Edit className="mr-2 size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={deleteMutation.isPending}
            onClick={() => deleteAccount()}
          >
            <Trash className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
