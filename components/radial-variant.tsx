import { COLORS } from "@/constants/consts";
import { formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  RadialBarChart,
  Legend,
  RadialBar,
} from "recharts";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export const RadialVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        cx="50%"
        cy="30%"
        barSize={10}
        innerRadius="90%"
        outerRadius="40%"
        data={data.map((item, i) => ({
          ...item,
          fill: COLORS[i % COLORS.length],
        }))}
      >
        <RadialBar
          label={{ fill: "#FFF", position: "insideStart", fontSize: "12px" }}
          background
          dataKey="value"
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          content={({ payload }) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload?.map((entry, i) => {
                  return (
                    <li
                      key={`item_${i}`}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className="space-x-1">
                        <span className="text-sm text-muted-foreground">
                          {entry.value}
                        </span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(entry.payload?.value * -1, true)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
