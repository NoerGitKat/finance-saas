import { PieChart, FileSearch, Radar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSwitchChart } from "@/features/summary/hooks/use-switch-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PieVariant } from "./pie-variant";

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const Pie = ({ data = [] }: Props) => {
  const { chartType, switchChart } = useSwitchChart("pie");
  return (
    <Card>
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Categories</CardTitle>
        <Select defaultValue={chartType} onValueChange={switchChart}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="mr-1 size-4 shrink-0" />
                <p className="line-clamp-1">Pie</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="mr-1 size-4 shrink-0" />
                <p className="line-clamp-1">Radar</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <Target className="mr-1 size-4 shrink-0" />
                <p className="line-clamp-1">Radial</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
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
            {chartType === "pie" && <PieVariant data={data} />}
            {chartType === "radar" && null}
            {chartType === "radial" && null}
          </>
        )}
      </CardContent>
    </Card>
  );
};
