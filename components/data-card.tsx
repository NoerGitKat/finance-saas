import { cva, VariantProps } from "class-variance-authority";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
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
        <p>{value}</p>
        <p>{percentageChange}</p>
      </CardContent>
    </Card>
  );
};
