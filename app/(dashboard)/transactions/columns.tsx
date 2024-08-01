"use client";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { TableActions } from "./table-actions";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AccountColumn } from "./account-column";
import { CategoryColumn } from "./category-column";

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
      return (
        <Badge
          className={row.original.amount < 0 ? "bg-rose-400" : "bg-emerald-400"}
        >
          {formatCurrency(row.original.amount, true)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <CategoryColumn
          category={row.original.category}
          categoryId={row.original.categoryId}
        />
      );
    },
  },

  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => {
      return (
        <AccountColumn
          account={row.original.account}
          accountId={row.original.accountId}
        />
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  { id: "actions", cell: ({ row }) => <TableActions id={row.original.id} /> },
];
