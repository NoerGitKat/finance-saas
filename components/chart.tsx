import { FileSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";

type Props = {
  data?: {
    income: number;
    expenses: number;
    date: string;
  }[];
};

export const Chart = ({ data = [] }: Props) => {
  return (
    <Card>
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
        {/* TODO: Add select */}
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-y-4">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data for this period
            </p>
          </div>
        ) : (
          <>
            <AreaVariant data={data} />
            <BarVariant data={data} />
            <LineVariant data={data} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
