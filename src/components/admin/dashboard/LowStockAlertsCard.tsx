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
import { LowStockAlert } from "@/types/admin/inventory";

interface LowStockAlertsCardProps {
  alerts: LowStockAlert[];
  isLoading?: boolean;
}

export default function LowStockAlertsCard({
  alerts,
  isLoading,
}: LowStockAlertsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Low Stock Alerts
        </CardTitle>
        <CardDescription>Products need restocking</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100"></div>
                </div>
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center text-center">
            <Package className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              All products well stocked!
            </p>
            <p className="text-xs text-gray-500">
              No items below minimum stock level
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 space-y-3">
              {alerts.slice(0, 10).map((alert) => (
                <div
                  key={`${alert.storeId}-${alert.productId}`}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    alert.isOutOfStock
                      ? "border-red-200 bg-red-50"
                      : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border bg-white">
                    {alert.product.picture1 ? (
                      <Image
                        src={alert.product.picture1}
                        alt={alert.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-medium text-gray-900">
                      {alert.product.name}
                    </h4>
                    <p className="truncate text-xs text-gray-600">
                      {alert.store
                        ? `${alert.store.name} • ${alert.product.category.name}`
                        : alert.product.category.name}
                    </p>
                  </div>

                  {/* Stock Info */}
                  <div className="flex-shrink-0 text-right">
                    <p
                      className={`text-sm font-bold whitespace-nowrap ${
                        alert.isOutOfStock ? "text-red-600" : "text-yellow-600"
                      }`}
                    >
                      {alert.stock} / {alert.minStock}
                    </p>
                    <p className="text-xs whitespace-nowrap text-gray-500">
                      {alert.isOutOfStock ? "Out of Stock" : "Low Stock"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {alerts.length > 10 && (
              <Link href="/admin/inventory/reports">
                <Button variant="outline" size="sm" className="w-full">
                  View All {alerts.length} Alerts
                </Button>
              </Link>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
