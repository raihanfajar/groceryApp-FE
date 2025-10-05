import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LowStockAlert, Store } from "@/types/admin/inventory";

interface LowStockAlertsSectionProps {
  alerts: LowStockAlert[];
  stores?: Store[];
  isSuper?: boolean;
  maxDisplay?: number;
  showViewAll?: boolean;
}

const LowStockAlertsSection: React.FC<LowStockAlertsSectionProps> = ({
  alerts,
  stores = [],
  isSuper = false,
  maxDisplay = 5,
  showViewAll = true,
}) => {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span>Low Stock Alerts</span>
        </CardTitle>
        <CardDescription>
          Products that need immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.slice(0, maxDisplay).map((alert) => {
            const alertStore = stores.find((s) => s.id === alert.storeId);
            return (
              <div
                key={`${alert.storeId}-${alert.productId}`}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex flex-1 items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    {alert.product.picture1 ? (
                      <Image
                        src={alert.product.picture1}
                        alt={alert.product.name}
                        width={32}
                        height={32}
                        className="rounded object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{alert.product.name}</h4>
                    <p className="text-sm text-gray-600">
                      {alert.product.category.name}
                    </p>
                    {isSuper && alertStore && (
                      <p className="mt-1 text-xs font-medium text-blue-600">
                        📍 {alertStore.name} - {alertStore.city}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Stock:{" "}
                      <span className="text-red-600">{alert.stock}</span> /{" "}
                      {alert.minStock}
                    </p>
                    <p className="text-xs text-gray-500">
                      {alert.isOutOfStock ? "Out of Stock" : "Low Stock"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/inventory/stock?storeId=${alert.storeId}&sortBy=stock-asc`}
                  >
                    <Button size="sm" variant="default">
                      Action
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
          {showViewAll && alerts.length > maxDisplay && (
            <div className="text-center">
              <Link href="/admin/inventory/reports">
                <Button variant="outline" size="sm">
                  View All {alerts.length} Alerts
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockAlertsSection;
