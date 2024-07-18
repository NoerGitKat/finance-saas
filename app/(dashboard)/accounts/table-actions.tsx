"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount } from "@/features/accounts/hooks/use-account";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const TableActions = ({ id }: Props) => {
  const { openModal } = useAccount();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={false}
            onClick={() => openModal(id)}
          >
            <Edit className="mr-2 size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={false}
            onClick={() => openModal(id)}
          >
            <Trash className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
