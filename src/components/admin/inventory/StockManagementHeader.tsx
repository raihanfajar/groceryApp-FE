import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Upload, Download, ArrowLeft, Grid3x3, List } from "lucide-react";
import { useRouter } from "next/navigation";

interface StockManagementHeaderProps {
  isSuper: boolean;
  storeName?: string;
  stats?: {
    productsUpdatedToday: number;
    lowStockAlerts: number;
    stockMovementsToday: number;
  };
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

const StockManagementHeader: React.FC<StockManagementHeaderProps> = ({
  isSuper,
  storeName,
  stats,
  viewMode = "grid",
  onViewModeChange,
}) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/inventory")}
              className="text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600">
            {isSuper
              ? "Manage stock levels across all stores"
              : `Manage stock for ${storeName || "your store"}`}
          </p>
        </div>
        <div className="flex space-x-2">
          {onViewModeChange && (
            <div className="flex items-center space-x-1 border rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="h-8 px-3"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Stock
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import Stock
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.productsUpdatedToday ?? 0}
              </div>
              <div className="text-sm text-gray-600">
                Products Updated Today
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats?.lowStockAlerts ?? 0}
              </div>
              <div className="text-sm text-gray-600">Low Stock Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats?.stockMovementsToday ?? 0}
              </div>
              <div className="text-sm text-gray-600">Stock Movements Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockManagementHeader;
