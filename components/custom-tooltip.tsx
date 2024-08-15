import { format } from "date-fns";
import { Separator } from "./ui/separator";
import { formatCurrency } from "@/lib/utils";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  const date = payload[0].payload.date as string;
  const income = payload[0].value as number;
  const expenses = payload[1].value as number;

  return (
    <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
      <div className="bg-muted px-3 py-2 text-sm text-muted-foreground">
        {format(date, "MMM dd, yyyy")}
      </div>
      <Separator />
      <div className="space-y-1 px-3 py-2">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <p className="text-sm text-muted-foreground">Income</p>
          </div>
          <p className="text-right text-sm font-medium">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-right text-sm font-medium">
            {formatCurrency(expenses * -1)}
          </p>
        </div>
      </div>
    </div>
  );
};
