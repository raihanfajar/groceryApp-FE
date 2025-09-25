import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, RefreshCw, TrendingUp } from "lucide-react";

interface InventoryReportsHeaderProps {
  isSuper: boolean;
  storeName?: string;
  onRefresh: () => void;
}

const InventoryReportsHeader: React.FC<InventoryReportsHeaderProps> = ({
  isSuper,
  storeName,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Reports
          </h1>
          <p className="text-gray-600">
            {isSuper
              ? "Analytics and insights across all stores"
              : `Analytics and insights for ${storeName || "your store"}`}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Report Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                <TrendingUp className="mx-auto mb-2 h-8 w-8" />
              </div>
              <div className="text-sm text-gray-600">Real-time Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Active Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-gray-600">Low Stock Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">IDR 0</div>
              <div className="text-sm text-gray-600">Total Stock Value</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReportsHeader;
