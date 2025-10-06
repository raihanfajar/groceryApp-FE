import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Archive, AlertTriangle, TrendingUp } from "lucide-react";
import { InventorySummary } from "@/types/admin/inventory";

interface InventoryStatsCardsProps {
  summary: InventorySummary | null;
  loading: boolean;
}

export default function InventoryStatsCards({
  summary,
  loading,
}: InventoryStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : summary?.totalProducts || 0}
          </div>
          <p className="text-muted-foreground text-xs">
            Active products in store
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          <Archive className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : summary?.totalStock || 0}
          </div>
          <p className="text-muted-foreground text-xs">Units available</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Alerts
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {loading ? "..." : summary?.lowStockProducts || 0}
          </div>
          <p className="text-muted-foreground text-xs">
            Products below minimum
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Recent Movements
          </CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : summary?.recentMovements || 0}
          </div>
          <p className="text-muted-foreground text-xs">In the last 24 hours</p>
        </CardContent>
      </Card>
    </div>
  );
}
