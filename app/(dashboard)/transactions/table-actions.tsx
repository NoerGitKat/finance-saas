"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useDeleteTransaction from "@/features/transactions/api/use-delete-transaction";
import { useTransaction } from "@/features/transactions/hooks/use-transaction";
import { useConfirmAction } from "@/hooks";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const TableActions = ({ id }: Props) => {
  const { openModal } = useTransaction();
  const [ConfirmationDialog, confirmAction] = useConfirmAction(
    "Are you sure?",
    `You are about to delete`,
    "this transaction",
  );
  const deleteMutation = useDeleteTransaction(id);

  const deleteTransaction = async () => {
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
            onClick={() => deleteTransaction()}
          >
            <Trash className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
