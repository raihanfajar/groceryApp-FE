import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface MonthlySalesCardProps {
  amount: number;
  period?: string;
  isLoading?: boolean;
}

export default function MonthlySalesCard({
  amount,
  period,
  isLoading,
}: MonthlySalesCardProps) {
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
        <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
        <TrendingUp className="text-muted-foreground h-4 w-4" />
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
            <p className="text-muted-foreground text-xs">
              {period || "This month"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
