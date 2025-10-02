import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface DailySalesCardProps {
  amount: number;
  isLoading?: boolean;
  comparisonText?: string;
  trend?: "up" | "down" | "neutral";
}

export default function DailySalesCard({
  amount,
  isLoading,
  comparisonText,
  trend = "neutral",
}: DailySalesCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
        <DollarSign className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
            {comparisonText && (
              <p className="text-muted-foreground flex items-center gap-1 text-xs">
                {trend === "up" && (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                )}
                {trend === "down" && (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span>{comparisonText}</span>
              </p>
            )}
            {!comparisonText && (
              <p className="text-muted-foreground text-xs">
                Today&apos;s revenue
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
