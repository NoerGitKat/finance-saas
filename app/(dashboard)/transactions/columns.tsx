"use client";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { TableActions } from "./table-actions";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
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
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // {
  //   accessorKey: "date",
  //   header: "Date",
  // },
  // {
  //   accessorKey: "receiver",
  //   header: "Receiver",
  // },
  // {
  //   accessorKey: "amount",
  //   header: "Amount",
  // },
  // {
  //   accessorKey: "notes",
  //   header: "Notes",
  // },
  // {
  //   accessorKey: "category",
  //   header: "Category",
  // },

  // {
  //   accessorKey: "account",
  //   header: "Account",
  // },
  { id: "actions", cell: ({ row }) => <TableActions id={row.original.id} /> },
];
