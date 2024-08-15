import { cva, VariantProps } from "class-variance-authority";
import CountUp from "react-countup";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { LucideProps } from "lucide-react";

const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      wanrning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-500/20",
      success: "fill-emerald-500/20",
      danger: "fill-rose-500/20",
      wanrning: "fill-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface Props extends BoxVariants, IconVariants {
  title: string;
  value?: number | undefined;
  percentageChange?: number | undefined;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  dateRangeLabel: string;
}

export const DataCard = ({
  title = "Default Title",
  value = 0,
  percentageChange = 0,
  icon: Icon,
  variant,
  dateRangeLabel,
}: Props) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-2xl">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRangeLabel}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1
          className={cn(
            "font-bol mb-2 line-clamp-1 break-all text-2xl",
            value > 0 ? "text-emerald-500" : "text-rose-500",
          )}
        >
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCurrency}
          />
        </h1>
        <p
          className={cn(
            "line-clamp-1 text-sm text-muted-foreground",
            percentageChange > 0 ? "text-emerald-500" : "text-rose-500",
          )}
        >
          {formatPercentage(percentageChange, { addPrefix: true })} from last
          period
        </p>
      </CardContent>
    </Card>
  );
};
