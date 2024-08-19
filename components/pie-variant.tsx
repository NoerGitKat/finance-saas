import {
  ResponsiveContainer,
  PieChart,
  Legend,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import { COLORS } from "@/constants/consts";
import { formatPercentage } from "@/lib/utils";
import { CategoryTooltip } from "./category-tooltip";
import { Payload } from "recharts/types/component/DefaultLegendContent";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export const PieVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          iconType="circle"
          content={({ payload }) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload?.map((entry, index) => {
                  const typedEntry = entry as Payload & {
                    payload: { percent: number };
                  };
                  return (
                    <li
                      key={`item_${index}`}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: typedEntry.color }}
                      />
                      <div className="space-x-1">
                        <span className="text-sm text-muted-foreground">
                          {typedEntry.value}
                        </span>
                        <span className="text-sm font-semibold">
                          {formatPercentage(typedEntry.payload?.percent * 100)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          }}
        />
        <Tooltip content={<CategoryTooltip />} />
        <Pie
          data={data}
          dataKey="value"
          fill="#8884d8"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          labelLine={false}
        >
          {data.map((_entry, i) => (
            <Cell key={`cell_${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
