"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardReport } from "@/hooks/admin/reports/useDashboardReport";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  Package,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReportFilters from "./ReportFilters";
import TopSellingProductsCard from "../dashboard/TopSellingProductsCard";

interface DashboardOverviewProps {
  storeId?: string;
  month: number;
  year: number;
  onStoreChange: (storeId: string) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function DashboardOverview({
  storeId,
  month,
  year,
  onStoreChange,
  onMonthChange,
  onYearChange,
}: DashboardOverviewProps) {
  const { data, isLoading, error } = useDashboardReport({
    storeId,
    month,
    year,
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ReportFilters
        storeId={storeId}
        month={month}
        year={year}
        onStoreChange={onStoreChange}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
      />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp{" "}
              {(data?.sales?.summary?.totalSales || 0).toLocaleString("id-ID")}
            </div>
            <p className="text-muted-foreground text-xs">
              {data?.sales?.summary?.totalTransactions || 0} orders
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <ShoppingCart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp{" "}
              {(data?.sales?.summary?.averageOrderValue || 0).toLocaleString(
                "id-ID",
              )}
            </div>
            <p className="text-muted-foreground text-xs">Per transaction</p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data?.stock?.summary?.totalProducts || 0).toLocaleString(
                "id-ID",
              )}
            </div>
            <p className="text-muted-foreground text-xs">In inventory</p>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.stock?.summary?.lowStockCount || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products - Full Width */}
      <TopSellingProductsCard
        products={
          data?.sales?.topProducts?.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            categoryName: product.categoryName,
            picture: product.picture,
            quantitySold: product.quantitySold,
            totalRevenue: product.totalRevenue,
          })) || []
        }
        isLoading={isLoading}
      />

      {/* Low Stock Items */}
      {data?.stock?.lowStockAlerts && data.stock.lowStockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.stock.lowStockAlerts.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-muted-foreground text-sm">
                      Current: {product.currentStock} / Min: {product.minStock}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.status === "OUT"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.status === "OUT" ? "Out of Stock" : "Low Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
