"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ProductPieChartProps {
  data: DataPoint[];
  title: string;
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  height?: number;
  showPercentage?: boolean;
}

const DEFAULT_COLORS = [
  "#2563eb", // blue
  "#7c3aed", // purple
  "#db2777", // pink
  "#dc2626", // red
  "#ea580c", // orange
  "#ca8a04", // yellow
  "#16a34a", // green
  "#0891b2", // cyan
  "#6366f1", // indigo
  "#8b5cf6", // violet
];

export default function ProductPieChart({
  data,
  title,
  dataKey = "value",
  nameKey = "name",
  colors = DEFAULT_COLORS,
  height = 300,
  showPercentage = true,
}: ProductPieChartProps) {
  const formatTooltip = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  const total = data.reduce((sum, item) => sum + Number(item[dataKey] || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={
                showPercentage
                  ? (entry) => {
                      const percentage = (
                        (Number(entry[dataKey] || 0) / total) *
                        100
                      ).toFixed(1);
                      return `${percentage}%`;
                    }
                  : undefined
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => {
                const item = data.find((d) => d[nameKey] === value);
                if (item) {
                  const total = data.reduce(
                    (sum, d) => sum + Number(d[dataKey] || 0),
                    0,
                  );
                  const percentage = (
                    (Number(item[dataKey] || 0) / total) *
                    100
                  ).toFixed(1);
                  return `${value} (${percentage}%)`;
                }
                return value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
