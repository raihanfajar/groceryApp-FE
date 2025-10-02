"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Package,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import ReportFilters from "./ReportFilters";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { MonthlyStockReport } from "@/types/reports";

interface StockReportsProps {
  storeId?: string;
  month: number;
  year: number;
  onStoreChange: (storeId: string) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function StockReports({
  storeId,
  month,
  year,
  onStoreChange,
  onMonthChange,
  onYearChange,
}: StockReportsProps) {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  const { data, isLoading, error } = useQuery({
    queryKey: ["stock-report-monthly", storeId, month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (storeId) params.append("storeId", storeId);
      params.append("month", month.toString());
      params.append("year", year.toString());

      const response = await axiosInstance.get<{ data: MonthlyStockReport }>(
        `/reports/stock/monthly?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.data;
    },
    enabled: !!token && !!month && !!year,
  });

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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load stock data. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalProducts || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {data.lowStockProducts || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Out of Stock
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {data.outOfStockProducts || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stock Value
                </CardTitle>
                <Package className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {(data.stockValue || 0).toLocaleString("id-ID")}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock Movements */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              {data.stockMovements && data.stockMovements.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {data.stockMovements.map(
                    (movement: {
                      type: "IN" | "OUT" | "ADJUSTMENT";
                      quantity: number;
                      count: number;
                    }) => (
                      <div
                        key={movement.type}
                        className="flex flex-col space-y-2 rounded-lg border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-medium ${
                              movement.type === "IN"
                                ? "text-green-600"
                                : movement.type === "OUT"
                                  ? "text-red-600"
                                  : "text-blue-600"
                            }`}
                          >
                            {movement.type === "IN"
                              ? "Stock In"
                              : movement.type === "OUT"
                                ? "Stock Out"
                                : "Adjustments"}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {movement.count || 0} transactions
                          </span>
                        </div>
                        <div className="text-2xl font-bold">
                          {movement.type === "OUT" ? "-" : "+"}
                          {movement.quantity || 0} units
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center">
                  No stock movement data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Restocked Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Restocked Products</CardTitle>
            </CardHeader>
            <CardContent>
              {data.topRestockedProducts &&
              data.topRestockedProducts.length > 0 ? (
                <div className="space-y-4">
                  {data.topRestockedProducts.map(
                    (
                      product: {
                        productId: string;
                        productName: string;
                        quantity: number;
                      },
                      index: number,
                    ) => (
                      <div
                        key={product.productId}
                        className="flex items-center"
                      >
                        <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-muted-foreground text-sm">
                            Restocked quantity
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{product.quantity || 0} units
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center">
                  No restock data available for this period.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-muted-foreground py-8 text-center">
            No stock data available for the selected period.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
