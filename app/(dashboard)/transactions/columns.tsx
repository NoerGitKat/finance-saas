"use client";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { TableActions } from "./table-actions";
import { format } from "date-fns";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "transactions",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{format(row.original.date, "MM/dd/yyyy")}</span>;
    },
  },
  {
    accessorKey: "receiver",
    header: "Receiver",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <span>${convertAmountFromMiliunits(row.original.amount)}</span>;
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "category",
    header: "Category",
  },

  {
    accessorKey: "account",
    header: "Account",
  },
  { id: "actions", cell: ({ row }) => <TableActions id={row.original.id} /> },
];
