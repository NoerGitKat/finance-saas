import { Separator } from "./ui/separator";
import { formatCurrency } from "@/lib/utils";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export const CategoryTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  const name = payload[0].payload.name as string;
  const value = payload[0].value as number;

  return (
    <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
      <div className="bg-muted px-3 py-2 text-sm text-muted-foreground">
        {name}
      </div>
      <Separator />
      <div className="space-y-1 px-3 py-2">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-right text-sm font-medium">
            {formatCurrency(value * -1, true)}
          </p>
        </div>
      </div>
    </div>
  );
};
