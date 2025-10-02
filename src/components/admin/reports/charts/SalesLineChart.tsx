"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface SalesLineChartProps {
  data: DataPoint[];
  title: string;
  dataKey?: string;
  xAxisKey?: string;
  yAxisLabel?: string;
  color?: string;
  height?: number;
}

export default function SalesLineChart({
  data,
  title,
  dataKey = "value",
  xAxisKey = "name",
  yAxisLabel,
  color = "#2563eb",
  height = 300,
}: SalesLineChartProps) {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatTooltip = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={formatYAxis}
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "insideLeft" }
                  : undefined
              }
            />
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
