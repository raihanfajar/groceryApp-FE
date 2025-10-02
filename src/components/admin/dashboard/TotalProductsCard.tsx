import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface TotalProductsCardProps {
  count: number;
  isLoading?: boolean;
}

export default function TotalProductsCard({
  count,
  isLoading,
}: TotalProductsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        <Package className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {count.toLocaleString("id-ID")}
            </div>
            <p className="text-muted-foreground text-xs">
              Active products in inventory
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
